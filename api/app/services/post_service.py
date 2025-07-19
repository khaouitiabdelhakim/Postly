from sqlalchemy.orm import Session
from fastapi import HTTPException, status, UploadFile
from typing import List, Optional
import os
import shutil
import uuid
from app.models.post import Post
from app.models.user import User
from app.schemas.post import PostCreate, PostUpdate
from app.config import settings

class PostService:
    @staticmethod
    def create_post(db: Session, post: PostCreate, current_user: User) -> Post:
        db_post = Post(
            userId=current_user.id,
            text=post.text
        )
        
        db.add(db_post)
        db.commit()
        db.refresh(db_post)
        
        return db_post
    
    @staticmethod
    def get_post_by_id(db: Session, post_id: str) -> Post:
        post = db.query(Post).filter(Post.id == post_id).first()
        if not post:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Post not found"
            )
        return post
    
    @staticmethod
    def get_posts(db: Session, skip: int = 0, limit: int = 10) -> List[Post]:
        return db.query(Post).offset(skip).limit(limit).all()
    
    @staticmethod
    def get_user_posts(db: Session, user_id: str, skip: int = 0, limit: int = 10) -> List[Post]:
        return db.query(Post).filter(Post.userId == user_id).offset(skip).limit(limit).all()
    
    @staticmethod
    def update_post(db: Session, post_id: str, post_update: PostUpdate, current_user: User) -> Post:
        post = db.query(Post).filter(Post.id == post_id, Post.userId == current_user.id).first()
        if not post:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Post not found or you don't have permission to modify it"
            )
        
        if post_update.text is not None:
            post.text = post_update.text
        
        db.commit()
        db.refresh(post)
        
        return post
    
    @staticmethod
    def delete_post(db: Session, post_id: str, current_user: User) -> bool:
        post = db.query(Post).filter(Post.id == post_id, Post.userId == current_user.id).first()
        if not post:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Post not found or you don't have permission to delete it"
            )
        
        # Delete associated file if exists
        if post.blobUrl and os.path.exists(post.blobUrl):
            os.remove(post.blobUrl)
        
        db.delete(post)
        db.commit()
        
        return True
    
    @staticmethod
    def upload_media(db: Session, post_id: str, file: UploadFile, current_user: User) -> str:
        # Get the post and verify ownership
        post = db.query(Post).filter(Post.id == post_id, Post.userId == current_user.id).first()
        if not post:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Post not found or you don't have permission to modify it"
            )
        
        # Validate file size
        if file.size > settings.max_file_size:
            raise HTTPException(
                status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                detail=f"File too large. Maximum size is {settings.max_file_size} bytes"
            )
        
        # Create uploads directory if it doesn't exist
        os.makedirs(settings.upload_dir, exist_ok=True)
        
        # Save file
        file_extension = file.filename.split(".")[-1] if "." in file.filename else ""
        file_name = f"{uuid.uuid4()}.{file_extension}"
        file_path = f"{settings.upload_dir}/{file_name}"
        
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # Update post with file URL
        post.blobUrl = file_path
        db.commit()
        
        return file_path