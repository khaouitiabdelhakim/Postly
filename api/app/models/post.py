from sqlalchemy import Column, String, DateTime, Text, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid
from app.database import Base

class Post(Base):
    __tablename__ = "posts"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    userId = Column(String, ForeignKey("users.id"))
    blobUrl = Column(String, nullable=True)
    text = Column(Text)
    createdAt = Column(DateTime, default=datetime.utcnow)
    
    owner = relationship("User", back_populates="posts")