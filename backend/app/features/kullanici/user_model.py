from app.base.base_model import BaseModel
from pydantic import Field, EmailStr
from typing import Optional, List
from pymongo import IndexModel, ASCENDING


class User(BaseModel):
    email: EmailStr = Field(..., description="Kullanıcı email adresi")
    sifre_hash: str = Field(..., description="Hash'lenmiş şifre")
    telefon: Optional[str] = Field(None, description="Telefon numarası")
    rol: str = Field(default="client", description="Kullanıcı rolü (freelancer, client, admin)")
    profil_resmi: Optional[str] = Field(None, description="Profil resmi dosya yolu")
    
    baslik: Optional[str] = Field(None, description="Profesyonel başlık (ör: Full Stack Developer)")
    bio: Optional[str] = Field(None, description="Özgeçmiş/Hakkında")
    beceriler: List[str] = Field(default_factory=list, description="Beceri listesi")
    saatlik_ucret: Optional[float] = Field(None, description="Saatlik ücret (TL)")
    lokasyon: Optional[str] = Field(None, description="Şehir, Ülke")
    portfolio_resimleri: List[str] = Field(default_factory=list, description="Portfolio resim yolları")
    
    ortalama_puan: float = Field(default=0.0, description="Ortalama rating puanı")
    toplam_inceleme: int = Field(default=0, description="Toplam aldığı inceleme sayısı")
    tamamlanan_is_sayisi: int = Field(default=0, description="Tamamlanan iş sayısı")
    
    sirket_adi: Optional[str] = Field(None, description="Şirket adı (client için)")
    acilan_is_sayisi: int = Field(default=0, description="Açılan iş ilanı sayısı")
    
    class Settings:
        name = "users"
        use_state_management = True
        validate_on_save = True
        indexes = [
            IndexModel([("email", ASCENDING)], unique=True),
            IndexModel([("kisa_ad", ASCENDING)]),
            IndexModel([("silindi_mi", ASCENDING)]),
            IndexModel([("rol", ASCENDING)]),
            IndexModel([("ortalama_puan", ASCENDING)]),
        ]
