import sys
import os
import uvicorn

# Ensure the backend directory is in the Python search path when run from repository root
backend_dir = os.path.join(os.path.dirname(__file__), "backend")
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    host = os.getenv("HOST", "0.0.0.0")
    env = os.getenv("APP_ENV", "development").lower()
    reload = env == "development"
    print(f"Starting Murali Electronics Backend from root on http://{host}:{port} (env={env}, reload={reload})...")
    uvicorn.run("app.main:app", host=host, port=port, reload=reload)
