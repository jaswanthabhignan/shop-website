import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database import engine, Base
from app.seed_data import seed_database
from app.routes import (
    stores_router,
    categories_router,
    products_router,
    offers_router,
    enquiries_router,
    admin_router,
)

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("uvicorn.error")

# Initialize tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.APP_NAME,
    description="Backend API for Murali Electronics store catalogue and enquiry platform.",
    version="1.0.0"
)

# Setup CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    logger.info("Initializing database schema and verifying seed data...")
    try:
        seed_database()
    except Exception as e:
        logger.error(f"Startup seed error: {e}")

@app.get("/")
def root():
    return {
        "app": settings.APP_NAME,
        "status": "online",
        "docs": "/docs",
        "endpoints": {
            "stores": "/api/stores",
            "categories": "/api/categories",
            "products": "/api/products",
            "offers": "/api/offers",
            "enquiries": "/api/enquiries",
            "admin_stats": "/api/admin/stats"
        }
    }

@app.get("/health")
def health_check():
    return {"status": "ok", "env": settings.APP_ENV}

# Include API Routers under /api prefix
app.include_router(stores_router, prefix="/api")
app.include_router(categories_router, prefix="/api")
app.include_router(products_router, prefix="/api")
app.include_router(offers_router, prefix="/api")
app.include_router(enquiries_router, prefix="/api")
app.include_router(admin_router, prefix="/api")
