from typing import Dict, Any
from datetime import datetime
from app.base import BaseManager
from app.core import get_password_hash, verify_password, create_access_token
from app.core.validation import validate_password_strength, validate_phone
from .user_repo import UserRepo
from .user_model import User


class UserManager(BaseManager[User]):
    def __init__(self):
        self.repo = UserRepo()
        super().__init__(self.repo)
    
    async def register(self, data: Dict[str, Any]) -> User:
        email_exists = await self.repo.email_exists(data["email"])
        if email_exists:
            raise ValueError("Bu email adresi zaten kullanılıyor")
        
        is_valid, message = validate_password_strength(data.get("sifre", ""))
        if not is_valid:
            raise ValueError(message)
        
        if data.get("telefon") and not validate_phone(data["telefon"]):
            raise ValueError("Geçersiz telefon numarası formatı")
        
        sifre_hash = get_password_hash(data.pop("sifre"))
        data["sifre_hash"] = sifre_hash
        if "rol" not in data or data["rol"] not in ["freelancer", "client"]:
            data["rol"] = "client"
        
        if not data.get("kisa_ad"):
            data["kisa_ad"] = data["email"].split("@")[0]
        
        return await self.repo.create(data)
    
    async def login(self, email: str, sifre: str) -> Dict[str, Any]:
        user = await self.repo.get_by_email(email)
        
        if not user:
            raise ValueError("Email veya şifre hatalı")
        
        if not verify_password(sifre, user.sifre_hash):
            raise ValueError("Email veya şifre hatalı")
        
        if not user.aktif_mi:
            raise ValueError("Hesabınız aktif değil")
        
        access_token = create_access_token(
            data={"sub": str(user.id), "email": user.email, "rol": user.rol}
        )
        
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": user
        }
    
    async def change_password(self, user_id: str, old_password: str, new_password: str) -> bool:
        user = await self.get_one(user_id)
        
        if not verify_password(old_password, user.sifre_hash):
            raise ValueError("Mevcut şifre yanlış")
        
        is_valid, message = validate_password_strength(new_password)
        if not is_valid:
            raise ValueError(message)
        
        user.sifre_hash = get_password_hash(new_password)
        user.degistirilme_tarihi = datetime.utcnow()
        await user.save()
        return True
