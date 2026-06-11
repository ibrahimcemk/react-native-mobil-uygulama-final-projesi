from app.base.base_model import BaseModel
from pydantic import Field
from typing import Optional
from pymongo import IndexModel, ASCENDING, DESCENDING


class Review(BaseModel):
    proje_id: str = Field(..., description="Proje ID")
    degerlendiren_id: str = Field(..., description="Değerlendiren kullanıcı ID")
    degerlendirilen_id: str = Field(..., description="Değerlendirilen kullanıcı ID")
    
    puan: float = Field(..., ge=1, le=5, description="Puan (1-5)")
    yorum: Optional[str] = Field(None, description="Yorum metni")
    
    iletisim_puani: Optional[float] = Field(None, ge=1, le=5, description="İletişim puanı")
    kalite_puani: Optional[float] = Field(None, ge=1, le=5, description="Kalite puanı")
    sure_puani: Optional[float] = Field(None, ge=1, le=5, description="Zamanında teslim puanı")
    
    class Settings:
        name = "reviews"
        use_state_management = True
        validate_on_save = True
        indexes = [
            IndexModel([("proje_id", ASCENDING)]),
            IndexModel([("degerlendiren_id", ASCENDING)]),
            IndexModel([("degerlendirilen_id", ASCENDING)]),
            IndexModel([("puan", DESCENDING)]),
            IndexModel([("silindi_mi", ASCENDING)]),
            IndexModel([("olusturulma_tarihi", DESCENDING)]),
            IndexModel([("proje_id", ASCENDING), ("degerlendiren_id", ASCENDING)], unique=True),
        ]
