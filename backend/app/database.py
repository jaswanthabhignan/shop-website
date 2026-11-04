import logging
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from app.config import settings

logger = logging.getLogger("uvicorn.error")

Base = declarative_base()

def get_engine():
    db_url = settings.DATABASE_URL
    try:
        # Check if PostgreSQL URL
        if db_url.startswith("postgresql"):
            # Try connecting to postgres
            engine = create_engine(
                db_url,
                pool_pre_ping=True,
                pool_size=10,
                max_overflow=20,
                connect_args={"connect_timeout": 3}
            )
            # Test connection
            with engine.connect():
                logger.info(f"Connected to PostgreSQL database successfully at {db_url.split('@')[-1]}")
            return engine
        else:
            return create_engine(db_url, connect_args={"check_same_thread": False})
    except Exception as e:
        logger.warning(f"Could not connect to configured PostgreSQL ({e}). Falling back to local SQLite: {settings.SQLITE_FALLBACK_URL}")
        return create_engine(settings.SQLITE_FALLBACK_URL, connect_args={"check_same_thread": False})

engine = get_engine()
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
