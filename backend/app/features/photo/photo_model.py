from beanie import Document
from pydantic import Field
from typing import Optional
from datetime import datetime
from pymongo import IndexModel, ASCENDING, DESCENDING


class Photo(Document):
    kullanici_id: str = Field(..., description="Fotoğrafı yükleyen kullanıcı ID")
    kullanici_adi: Optional[str] = Field(None, description="Kullanıcı adı (cache)")
    kullanici_profil_resmi: Optional[str] = Field(None, description="Kullanıcı profil resmi (cache)")
    resim_url: str = Field(..., description="Fotoğraf URL'i")
    baslik: Optional[str] = Field(None, description="Fotoğraf başlığı")
    konum: Optional[str] = Field(None, description="Konum bilgisi")
    goruntulenme: int = Field(default=0, description="Görüntülenme sayısı")
    begeni_sayisi: int = Field(default=0, description="Beğeni sayısı")
    begenenler: list = Field(default_factory=list, description="Beğenen kullanıcı ID'leri")
    yorum_sayisi: int = Field(default=0, description="Yorum sayısı")
    herkese_acik: bool = Field(default=True, description="Public/Private")
    
    olusturulma_tarihi: datetime = Field(default_factory=datetime.utcnow)
    degistirilme_tarihi: datetime = Field(default_factory=datetime.utcnow)
    aktif_mi: bool = Field(default=True, description="Aktif durumu")
    silindi_mi: bool = Field(default=False, description="Soft delete için")
    
    def soft_delete(self):
       
        self.silindi_mi = True
        self.aktif_mi = False
        self.degistirilme_tarihi = datetime.utcnow()
    
    class Settings:
        name = "photos"
        use_state_management = True
        validate_on_save = True
        indexes = [
            IndexModel([("kullanici_id", ASCENDING)]),
            IndexModel([("olusturulma_tarihi", DESCENDING)]),
            IndexModel([("silindi_mi", ASCENDING)]),
            IndexModel([("aktif_mi", ASCENDING)]),
            IndexModel([("herkese_acik", ASCENDING)]),
        ]
