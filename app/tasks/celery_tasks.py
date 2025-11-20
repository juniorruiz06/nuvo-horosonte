from celery import Celery
from celery.schedules import crontab
from app.config import get_settings
from app.database import SessionLocal
from app.services.price_fetcher import PriceFetcher
from app.services.scraper import CompanyScraperScraper
from app.utils.logger import logger

settings = get_settings()

app = Celery('mineral_agent', broker=settings.celery_broker_url, backend=settings.celery_result_backend)

app.conf.beat_schedule = {
    'update-prices-daily': {
        'task': 'app.tasks.celery_tasks.update_prices',
        'schedule': crontab(hour=9, minute=0),  # 9 AM diariamente
    },
    'search-buyers-weekly': {
        'task': 'app.tasks.celery_tasks.search_buyers',
        'schedule': crontab(day_of_week=0, hour=10, minute=0),  # Domingos 10 AM
    },
}

@app.task
def update_prices():
    """Tarea programada: actualizar precios diariamente."""
    try:
        db = SessionLocal()
        PriceFetcher.store_prices(db)
        logger.info("Precios actualizados exitosamente")
        db.close()
        return {"status": "success", "message": "Prices updated"}
    except Exception as e:
        logger.error(f"Error updating prices: {str(e)}")
        return {"status": "error", "message": str(e)}

@app.task
def search_buyers():
    """Tarea programada: buscar nuevos compradores."""
    try:
        buyers = CompanyScraperScraper.search_buyers_trujillo()
        logger.info(f"Found {len(buyers)} buyers")
        return {"status": "success", "buyers_found": len(buyers)}
    except Exception as e:
        logger.error(f"Error searching buyers: {str(e)}")
        return {"status": "error", "message": str(e)}
