from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database import create_tables
from app.routes import auth, posts

def create_app() -> FastAPI:
    app = FastAPI(
        title=settings.app_name,
        version=settings.version,
        description="A modern social media API built with FastAPI"
    )

    # Add CORS middleware
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Include routers
    app.include_router(auth.router)
    app.include_router(posts.router)

    # Health check endpoint
    @app.get("/", tags=["Health"])
    def read_root():
        return {"message": f"Welcome to {settings.app_name} v{settings.version}"}
    
    @app.get("/health", tags=["Health"])
    def health_check():
        return {"status": "healthy", "version": settings.version}

    return app

# Create tables on startup
create_tables()

# Create app instance
app = create_app()