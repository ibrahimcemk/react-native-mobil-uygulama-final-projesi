from pydantic import BaseModel, Field, EmailStr
from typing import Optional, List
from app.base.base_schema import BaseSchema, BaseResponseSchema, BasePatchSchema
from datetime import datetime


class UserCreateSchema(BaseSchema):
    email: EmailStr = Field(..., description="Email adresi")
    sifre: str = Field(..., min_length=6, description="Şifre (en az 6 karakter)")
    telefon: Optional[str] = Field(None, description="Telefon numarası")
    rol: str = Field(default="client", description="Rol (freelancer, client)")


class UserResponseSchema(BaseResponseSchema):
    email: str
    telefon: Optional[str]
    rol: str
    profil_resmi_url: Optional[str] = None
    
    baslik: Optional[str] = None
    bio: Optional[str] = None
    beceriler: List[str] = []
    saatlik_ucret: Optional[float] = None
    lokasyon: Optional[str] = None
    portfolio_resimleri: List[str] = []
    
    ortalama_puan: float = 0.0
    toplam_inceleme: int = 0
    tamamlanan_is_sayisi: int = 0
    
    sirket_adi: Optional[str] = None
    acilan_is_sayisi: int = 0


class UserPatchSchema(BasePatchSchema):
    telefon: Optional[str] = None
    rol: Optional[str] = None
    baslik: Optional[str] = None
    bio: Optional[str] = None
    beceriler: Optional[List[str]] = None
    saatlik_ucret: Optional[float] = None
    lokasyon: Optional[str] = None
    sirket_adi: Optional[str] = None


class UserLoginSchema(BaseModel):
    email: EmailStr
    sifre: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponseSchema
