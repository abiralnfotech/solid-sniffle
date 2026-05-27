from app.repositories.user import UserRepository
from app.models.models import User
from app.core.exceptions import AppException
from fastapi import status

class UserService:
    def __init__(self, user_repo: UserRepository):
        self.user_repo = user_repo

    async def create_user(self, user_in: User) -> User:
        existing_user = await self.user_repo.get_by_phone(user_in.phone_number)
        if existing_user:
            raise AppException("User with this phone number already exists", status_code=status.HTTP_400_BAD_REQUEST)
        return await self.user_repo.create(user_in)

    async def get_user(self, user_id: str) -> User:
        user = await self.user_repo.get(user_id)
        if not user:
            raise AppException("User not found", status_code=status.HTTP_404_NOT_FOUND)
        return user
