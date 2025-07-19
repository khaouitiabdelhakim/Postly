from sqlalchemy.orm import Session
from app.schemas.user import UserCreate, UserLogin, UserResponse, Token
from app.services.auth_service import AuthService
from app.models.user import User

class AuthController:
    @staticmethod
    def signup(user: UserCreate, db: Session) -> UserResponse:
        db_user = AuthService.create_user(db, user)
        return UserResponse.from_orm(db_user)
    
    @staticmethod
    def signin(user: UserLogin, db: Session) -> Token:
        access_token = AuthService.authenticate_user(db, user)
        return Token(access_token=access_token, token_type="bearer")
    
    @staticmethod
    def get_current_user_info(current_user: User) -> UserResponse:
        return UserResponse.from_orm(current_user)