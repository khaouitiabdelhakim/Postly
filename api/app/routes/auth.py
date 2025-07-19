from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.controllers.auth import AuthController
from app.schemas.user import UserCreate, UserLogin, UserResponse, Token
from app.utils.dependencies import get_current_user
from app.models.user import User
from app.database import get_db

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/signup", response_model=UserResponse)
def signup(user: UserCreate, db: Session = Depends(get_db)):
    return AuthController.signup(user, db)

@router.post("/signin", response_model=Token)
def signin(user: UserLogin, db: Session = Depends(get_db)):
    return AuthController.signin(user, db)

@router.get("/me", response_model=UserResponse)
def get_current_user_info(current_user: User = Depends(get_current_user)):
    return AuthController.get_current_user_info(current_user)