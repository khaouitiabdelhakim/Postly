from fastapi import UploadFile
from sqlalchemy.orm import Session
from typing import List
from app.schemas.post import PostCreate, PostUpdate, PostResponse
from app.services.post_service import PostService
from app.models.user import User

class PostController:
    @staticmethod
    def _transform_blob_url(post_data: dict) -> dict:
        """Transform blob URL from filename to full URL"""
        original_blob_url = post_data.get('blobUrl')
        print(f"DEBUG: Original blobUrl: {repr(original_blob_url)}")
        
        if original_blob_url and not original_blob_url.startswith('http://localhost:8001'):
            new_blob_url = f"http://localhost:8001/posts/media/{original_blob_url}"
            print(f"DEBUG: Transformed blobUrl: {repr(new_blob_url)}")
            post_data['blobUrl'] = new_blob_url
        else:
            print(f"DEBUG: No transformation needed for blobUrl: {repr(original_blob_url)}")
        
        return post_data
    
    @staticmethod
    def create_post(post: PostCreate, current_user: User, db: Session) -> PostResponse:
        db_post = PostService.create_post(db, post, current_user)
        post_dict = PostResponse.from_orm(db_post).dict()
        return PostResponse(**PostController._transform_blob_url(post_dict))
    
    @staticmethod
    def get_posts(db: Session, skip: int = 0, limit: int = 10) -> List[PostResponse]:
        posts = PostService.get_posts(db, skip, limit)
        transformed_posts = []
        for post in posts:
            post_dict = PostResponse.from_orm(post).dict()
            transformed_posts.append(PostResponse(**PostController._transform_blob_url(post_dict)))
        return transformed_posts
    
    @staticmethod
    def get_post(post_id: str, db: Session) -> PostResponse:
        post = PostService.get_post_by_id(db, post_id)
        post_dict = PostResponse.from_orm(post).dict()
        return PostResponse(**PostController._transform_blob_url(post_dict))
    
    @staticmethod
    def get_user_posts(db: Session, user_id: str, skip: int = 0, limit: int = 10) -> List[PostResponse]:
        posts = PostService.get_user_posts(db, user_id, skip, limit)
        transformed_posts = []
        for post in posts:
            post_dict = PostResponse.from_orm(post).dict()
            transformed_posts.append(PostResponse(**PostController._transform_blob_url(post_dict)))
        return transformed_posts
    
    @staticmethod
    def update_post(post_id: str, post_update: PostUpdate, current_user: User, db: Session) -> PostResponse:
        updated_post = PostService.update_post(db, post_id, post_update, current_user)
        post_dict = PostResponse.from_orm(updated_post).dict()
        return PostResponse(**PostController._transform_blob_url(post_dict))
    
    @staticmethod
    def delete_post(post_id: str, current_user: User, db: Session) -> dict:
        PostService.delete_post(db, post_id, current_user)
        return {"message": "Post deleted successfully"}
    
    @staticmethod
    def upload_media(post_id: str, file: UploadFile, current_user: User, db: Session) -> dict:
        file_path = PostService.upload_media(db, post_id, file, current_user)
        # Return full URL instead of just filename
        full_url = f"http://localhost:8001/posts/media/{file_path}"
        return {"message": "File uploaded successfully", "blobUrl": full_url}