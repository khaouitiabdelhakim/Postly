from fastapi import APIRouter, Depends, File, UploadFile, HTTPException
from fastapi.responses import FileResponse
from typing import List
import os
from sqlalchemy.orm import Session
from app.controllers.posts import PostController
from app.schemas.post import PostCreate, PostUpdate, PostResponse
from app.utils.dependencies import get_current_user
from app.models.user import User
from app.database import get_db
from app.config import settings

router = APIRouter(prefix="/posts", tags=["Posts"])

@router.post("", response_model=PostResponse)
def create_post(
    post: PostCreate, 
    current_user: User = Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    return PostController.create_post(post, current_user, db)

@router.get("", response_model=List[PostResponse])
def get_posts(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    return PostController.get_posts(db, skip, limit)

@router.get("/{post_id}", response_model=PostResponse)
def get_post(post_id: str, db: Session = Depends(get_db)):
    return PostController.get_post(post_id, db)

@router.put("/{post_id}", response_model=PostResponse)
def update_post(
    post_id: str, 
    post_update: PostUpdate, 
    current_user: User = Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    return PostController.update_post(post_id, post_update, current_user, db)

@router.delete("/{post_id}")
def delete_post(
    post_id: str, 
    current_user: User = Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    return PostController.delete_post(post_id, current_user, db)

@router.post("/{post_id}/upload")
def upload_media(
    post_id: str, 
    file: UploadFile = File(...), 
    current_user: User = Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    return PostController.upload_media(post_id, file, current_user, db)

@router.get("/users/{user_id}", response_model=List[PostResponse])
def get_user_posts(user_id: str, skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    return PostController.get_user_posts(db, user_id, skip, limit)

@router.get("/media/{filename}")
def serve_media(filename: str):
    """Serve uploaded media files"""
    file_path = os.path.join(settings.upload_dir, filename)
    
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found")
    
    return FileResponse(
        file_path,
        headers={
            "Cache-Control": "public, max-age=3600",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET",
            "Access-Control-Allow-Headers": "*"
        }
    )