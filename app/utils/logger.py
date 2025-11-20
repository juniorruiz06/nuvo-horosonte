import logging
import json
from datetime import datetime
from app.config import get_settings

settings = get_settings()

logging.basicConfig(
    level=settings.log_level,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

logger = logging.getLogger("mineral-agent")

class AuditLog:
    @staticmethod
    def log_verification(field: str, url: str, result: bool, details: str = None):
        log_entry = {
            "timestamp": datetime.utcnow().isoformat(),
            "event": "verification",
            "field": field,
            "url": url,
            "result": result,
            "details": details
        }
        logger.info(json.dumps(log_entry))
        return log_entry

    @staticmethod
    def log_api_call(service: str, endpoint: str, status_code: int = None, error: str = None):
        log_entry = {
            "timestamp": datetime.utcnow().isoformat(),
            "event": "api_call",
            "service": service,
            "endpoint": endpoint,
            "status_code": status_code,
            "error": error
        }
        logger.info(json.dumps(log_entry))
        return log_entry
