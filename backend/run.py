import uvicorn
import os

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    host = os.getenv("HOST", "0.0.0.0")
    env = os.getenv("APP_ENV", "development").lower()
    reload = env == "development"
    print(f"Starting Murali Electronics Backend on http://{host}:{port} (env={env}, reload={reload})...")
    uvicorn.run("app.main:app", host=host, port=port, reload=reload)
