from beanie import Document
from pydantic import Field
from typing import Optional
from datetime import datetime
from pymongo import IndexModel, ASCENDING, DESCENDING


class PhotoComment(Document):
    photo_id: str = Field(..., description="Fotoğraf ID")
    kullanici_id: str = Field(..., description="Yorumu yapan kullanıcı ID")
    kullanici_adi: Optional[str] = Field(None, description="Kullanıcı adı (cache)")
    kullanici_profil_resmi: Optional[str] = Field(None, description="Kullanıcı profil resmi (cache)")
    yorum: str = Field(..., description="Yorum metni")
    olusturulma_tarihi: datetime = Field(default_factory=datetime.utcnow)
    silindi_mi: bool = Field(default=False)
    
    class Settings:
        name = "photo_comments"
        indexes = [
            IndexModel([("photo_id", ASCENDING)]),
            IndexModel([("kullanici_id", ASCENDING)]),
            IndexModel([("olusturulma_tarihi", DESCENDING)]),
            IndexModel([("silindi_mi", ASCENDING)]),
        ]
