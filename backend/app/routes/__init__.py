from app.routes.stores import router as stores_router
from app.routes.categories import router as categories_router
from app.routes.products import router as products_router
from app.routes.offers import router as offers_router
from app.routes.enquiries import router as enquiries_router
from app.routes.admin import router as admin_router

__all__ = [
    "stores_router",
    "categories_router",
    "products_router",
    "offers_router",
    "enquiries_router",
    "admin_router",
]
