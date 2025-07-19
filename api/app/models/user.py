from sqlalchemy import Column, String, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid
from app.database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    email = Column(String, unique=True, index=True)
    firstName = Column(String)
    lastName = Column(String)
    password = Column(String)
    creationDate = Column(DateTime, default=datetime.utcnow)
    birthday = Column(DateTime)
    
    posts = relationship("Post", back_populates="owner", cascade="all, delete-orphan")