import uvicorn
import os
from app.main import app

if __name__ == "__main__":
    # Get configuration from environment variables
    host = os.getenv("HOST", "0.0.0.0")  # Changed to 0.0.0.0 for Docker
    port = int(os.getenv("PORT", "8001"))
    reload = os.getenv("ENVIRONMENT", "development") != "production"
    
    uvicorn.run(
        "app.main:app",
        host=host,
        port=port,
        reload=reload
    )