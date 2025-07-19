from fastapi import UploadFile
from sqlalchemy.orm import Session
from typing import List
from app.schemas.post import PostCreate, PostUpdate, PostResponse
from app.services.post_service import PostService
from app.models.user import User

class PostController:
    @staticmethod
    def create_post(post: PostCreate, current_user: User, db: Session) -> PostResponse:
        db_post = PostService.create_post(db, post, current_user)
        return PostResponse.from_orm(db_post)
    
    @staticmethod
    def get_posts(db: Session, skip: int = 0, limit: int = 10) -> List[PostResponse]:
        posts = PostService.get_posts(db, skip, limit)
        return [PostResponse.from_orm(post) for post in posts]
    
    @staticmethod
    def get_post(post_id: str, db: Session) -> PostResponse:
        post = PostService.get_post_by_id(db, post_id)
        return PostResponse.from_orm(post)
    
    @staticmethod
    def get_user_posts(db: Session, user_id: str, skip: int = 0, limit: int = 10) -> List[PostResponse]:
        posts = PostService.get_user_posts(db, user_id, skip, limit)
        return [PostResponse.from_orm(post) for post in posts]
    
    @staticmethod
    def update_post(post_id: str, post_update: PostUpdate, current_user: User, db: Session) -> PostResponse:
        updated_post = PostService.update_post(db, post_id, post_update, current_user)
        return PostResponse.from_orm(updated_post)
    
    @staticmethod
    def delete_post(post_id: str, current_user: User, db: Session) -> dict:
        PostService.delete_post(db, post_id, current_user)
        return {"message": "Post deleted successfully"}
    
    @staticmethod
    def upload_media(post_id: str, file: UploadFile, current_user: User, db: Session) -> dict:
        file_path = PostService.upload_media(db, post_id, file, current_user)
        return {"message": "File uploaded successfully", "blob_url": file_path}