from sqlalchemy import create_engine, event
from sqlalchemy.orm import sessionmaker, declarative_base
from sqlalchemy.pool import StaticPool
from app.config import get_settings
import os

settings = get_settings()

# Crear directorio si no existe
db_dir = os.path.dirname(settings.database_url.replace("sqlite:///./", ""))
if db_dir and not os.path.exists(db_dir):
    os.makedirs(db_dir, exist_ok=True)

# Configuración específica para SQLite
connect_args = {}
engine_kwargs = {
    "echo": settings.sqlalchemy_echo,
}

if "sqlite" in settings.database_url:
    connect_args = {"check_same_thread": False}
    engine_kwargs["connect_args"] = connect_args
    engine_kwargs["poolclass"] = StaticPool
    
    engine = create_engine(settings.database_url, **engine_kwargs)
    
    # Habilitar foreign keys en SQLite
    @event.listens_for(engine, "connect")
    def set_sqlite_pragma(dbapi_conn, connection_record):
        cursor = dbapi_conn.cursor()
        cursor.execute("PRAGMA foreign_keys=ON")
        cursor.close()
else:
    engine = create_engine(settings.database_url, **engine_kwargs)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def init_db():
    """Inicializa la base de datos creando todas las tablas."""
    Base.metadata.create_all(bind=engine)
    print(f"✅ Base de datos inicializada en: {settings.database_url}")
