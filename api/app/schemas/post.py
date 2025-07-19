from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from app.schemas.user import UserResponse

class PostBase(BaseModel):
    text: str

class PostCreate(PostBase):
    pass

class PostUpdate(BaseModel):
    text: Optional[str] = None

class PostResponse(PostBase):
    id: str
    userId: str
    blobUrl: Optional[str] = None
    createdAt: datetime
    owner: UserResponse
    
    class Config:
        from_attributes = True

class PostListResponse(BaseModel):
    id: str
    userId: str
    blobUrl: Optional[str] = None
    text: str
    createdAt: datetime
    
    class Config:
        from_attributes = True