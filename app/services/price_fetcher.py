import requests
from sqlalchemy.orm import Session
from app.crud.price import create_price
from app.models.price import CommodityType
from app.utils.logger import AuditLog, logger
from app.config import get_settings

settings = get_settings()

class PriceFetcher:
    @staticmethod
    def fetch_bcrp_fx_rate() -> dict:
        """Obtiene tasa USD/PEN del BCRP (Banco Central de Reserva del Perú)."""
        try:
            # BCRP tiene una API pública
            url = "https://www.bcrp.gob.pe/webservices/GetTipoCambio"
            params = {"idioma": "1"}
            response = requests.get(url, params=params, timeout=10)
            
            AuditLog.log_api_call("BCRP", url, response.status_code)
            
            if response.status_code == 200:
                # BCRP devuelve XML; parsear según formato actual
                # Placeholder: asumir formato JSON
                data = response.json()
                return {
                    "rate": data.get("Moneda", [{}])[0].get("Venta", 0),
                    "source": "BCRP",
                    "currency_pair": "USD/PEN"
                }
        except Exception as e:
            logger.error(f"Error fetching BCRP FX rate: {str(e)}")
            AuditLog.log_api_call("BCRP", url, error=str(e))
        return None

    @staticmethod
    def fetch_metals_prices() -> dict:
        """Obtiene precios de metales (oro, plata, cobre)."""
        try:
            # Usar metals-api.com (requiere key) o Yahoo Finance
            url = "https://api.metals.live/v1/spot/metals?currencies=USD"
            response = requests.get(url, timeout=10)
            
            AuditLog.log_api_call("Metals.Live", url, response.status_code)
            
            if response.status_code == 200:
                data = response.json()
                return {
                    "gold": data.get("metals", {}).get("gold"),
                    "silver": data.get("metals", {}).get("silver"),
                    "copper": data.get("metals", {}).get("copper"),
                    "source": "Metals.Live",
                    "unit": "USD/oz"
                }
        except Exception as e:
            logger.error(f"Error fetching metals prices: {str(e)}")
            AuditLog.log_api_call("Metals.Live", url, error=str(e))
        return None

    @staticmethod
    def store_prices(db: Session):
        """Obtiene y almacena precios actuales en BD."""
        fx_data = PriceFetcher.fetch_bcrp_fx_rate()
        if fx_data:
            create_price(db, CommodityType.USD_PEN, fx_data["rate"], "PEN/USD", fx_data["source"])
        
        metals_data = PriceFetcher.fetch_metals_prices()
        if metals_data:
            create_price(db, CommodityType.GOLD, metals_data["gold"], metals_data["unit"], metals_data["source"])
            create_price(db, CommodityType.SILVER, metals_data["silver"], metals_data["unit"], metals_data["source"])
            create_price(db, CommodityType.COPPER, metals_data["copper"], metals_data["unit"], metals_data["source"])
