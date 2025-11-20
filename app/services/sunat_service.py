import requests
from app.utils.logger import logger, AuditLog
import json

class SUNATService:
    """Servicio para consultar empresas en SUNAT"""
    
    # Token personal del usuario
    API_TOKEN = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6InBlZHJvY2FycmFuemFlc2NvYmVkbzAwMUBnbWFpbC5jb20ifQ.syvWE3Jb4wg9YIdlRoS9z7DsPOEk1K3Dlrr2pMMjuG8"
    
    # URLs de APIs disponibles
    APIS = {
        "ruc": "https://api.apis.net.pe/v1/ruc",
        "dni": "https://api.apis.net.pe/v1/dni",
    }

    @staticmethod
    def search_by_ruc(ruc: str) -> dict:
        """
        Busca información de empresa por RUC en SUNAT
        
        Args:
            ruc: Número de RUC (11 dígitos)
            
        Returns:
            dict con información de la empresa
        """
        try:
            # Validar formato RUC
            if not ruc or len(ruc) != 11 or not ruc.isdigit():
                return {
                    "success": False,
                    "error": "RUC debe tener 11 dígitos numéricos",
                    "data": None
                }

            headers = {
                "Authorization": f"Bearer {SUNATService.API_TOKEN}",
                "Content-Type": "application/json"
            }

            url = f"{SUNATService.APIS['ruc']}/{ruc}"
            
            logger.info(f"Consultando RUC: {ruc}")
            response = requests.get(url, headers=headers, timeout=10)
            
            AuditLog.log_api_call("SUNAT_RUC", url, response.status_code)

            if response.status_code == 200:
                data = response.json()
                logger.info(f"✅ RUC encontrado: {ruc}")
                return {
                    "success": True,
                    "error": None,
                    "data": {
                        "ruc": data.get("ruc"),
                        "name": data.get("razonSocial", data.get("nombre")),
                        "business_name": data.get("razonSocial"),
                        "status": data.get("estado", "Activo"),
                        "address": data.get("direccion"),
                        "phone": data.get("telefono"),
                        "email": data.get("email"),
                        "activity": data.get("actividadEconomica"),
                        "establishment_date": data.get("fechaConstitucion"),
                        "legal_representative": data.get("representanteLegal"),
                        "raw_data": data
                    }
                }
            elif response.status_code == 404:
                logger.warning(f"RUC no encontrado: {ruc}")
                return {
                    "success": False,
                    "error": "RUC no encontrado en SUNAT",
                    "data": None
                }
            else:
                logger.error(f"Error SUNAT: {response.status_code}")
                return {
                    "success": False,
                    "error": f"Error en SUNAT: {response.status_code}",
                    "data": None
                }

        except requests.exceptions.Timeout:
            logger.error("Timeout consultando SUNAT")
            return {
                "success": False,
                "error": "Timeout: SUNAT no responde",
                "data": None
            }
        except Exception as e:
            logger.error(f"Error consultando RUC: {str(e)}")
            return {
                "success": False,
                "error": str(e),
                "data": None
            }

    @staticmethod
    def search_by_dni(dni: str) -> dict:
        """
        Busca información de persona natural por DNI
        
        Args:
            dni: Número de DNI (8 dígitos)
            
        Returns:
            dict con información de la persona
        """
        try:
            # Validar formato DNI
            if not dni or len(dni) != 8 or not dni.isdigit():
                return {
                    "success": False,
                    "error": "DNI debe tener 8 dígitos numéricos",
                    "data": None
                }

            headers = {
                "Authorization": f"Bearer {SUNATService.API_TOKEN}",
                "Content-Type": "application/json"
            }

            url = f"{SUNATService.APIS['dni']}/{dni}"
            
            logger.info(f"Consultando DNI: {dni}")
            response = requests.get(url, headers=headers, timeout=10)
            
            AuditLog.log_api_call("SUNAT_DNI", url, response.status_code)

            if response.status_code == 200:
                data = response.json()
                logger.info(f"✅ DNI encontrado: {dni}")
                return {
                    "success": True,
                    "error": None,
                    "data": {
                        "dni": data.get("dni"),
                        "name": data.get("nombre"),
                        "last_name": data.get("apellidos"),
                        "status": data.get("estado", "Activo"),
                        "address": data.get("direccion"),
                        "phone": data.get("telefono"),
                        "email": data.get("email"),
                        "raw_data": data
                    }
                }
            elif response.status_code == 404:
                logger.warning(f"DNI no encontrado: {dni}")
                return {
                    "success": False,
                    "error": "DNI no encontrado",
                    "data": None
                }
            else:
                return {
                    "success": False,
                    "error": f"Error en SUNAT: {response.status_code}",
                    "data": None
                }

        except requests.exceptions.Timeout:
            return {
                "success": False,
                "error": "Timeout: SUNAT no responde",
                "data": None
            }
        except Exception as e:
            logger.error(f"Error consultando DNI: {str(e)}")
            return {
                "success": False,
                "error": str(e),
                "data": None
            }
