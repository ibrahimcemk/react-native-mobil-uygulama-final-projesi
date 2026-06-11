from typing import Optional
from app.base import BaseRepo
from .user_model import User


class UserRepo(BaseRepo[User]):
    def __init__(self):
        super().__init__(User)
    
    async def get_by_email(self, email: str) -> Optional[User]:
        user = await self.model.find_one(
            self.model.email == email,
            self.model.silindi_mi == False
        )
        return user
    
    async def email_exists(self, email: str) -> bool:
        count = await self.model.find(
            self.model.email == email,
            self.model.silindi_mi == False
        ).count()
        return count > 0
