from contextlib import asynccontextmanager
import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database import engine, Base
import app.models  # Ensure all models are registered with Base.metadata
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

@asynccontextmanager
async def lifespan(app: FastAPI):
    # --- Startup Logic ---
    logger.info("Initializing database schema and verifying seed data...")
    try:
        Base.metadata.create_all(bind=engine)
        seed_database()
    except Exception as e:
        logger.error(f"Startup database initialization error: {e}")
    
    yield
    
    # --- Shutdown Logic (if any cleanup is needed) ---
    logger.info("Shutting down application...")

app = FastAPI(
    title=settings.APP_NAME,
    description="Backend API for Murali Electronics store catalogue and enquiry platform.",
    version="1.0.0",
    lifespan=lifespan
)

# Setup CORS with wildcard protection when credentials are used
cors_origins = [o for o in settings.CORS_ORIGINS if o != "*"]
has_wildcard = "*" in settings.CORS_ORIGINS

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins if not has_wildcard else [],
    allow_origin_regex=r"^https?://.*" if has_wildcard else None,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
@app.get("/api")
@app.get("/api/")
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
@app.get("/api/health")
def health_check():
    return {"status": "ok", "env": settings.APP_ENV}

# Include API Routers under /api prefix
app.include_router(stores_router, prefix="/api")
app.include_router(categories_router, prefix="/api")
app.include_router(products_router, prefix="/api")
app.include_router(offers_router, prefix="/api")
app.include_router(enquiries_router, prefix="/api")
app.include_router(admin_router, prefix="/api")