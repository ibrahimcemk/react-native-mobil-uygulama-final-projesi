from beanie import Document
from pydantic import Field
from datetime import datetime
from typing import Optional, List
from bson import ObjectId


class BaseModel(Document):
    ad: str = Field(..., description="Kayıt adı")
    kisa_ad: Optional[str] = Field(None, description="Kısa ad veya kod", index=True)
    aciklama: Optional[str] = Field(None, description="Açıklama")
    etiketler: List[str] = Field(default_factory=list, description="Etiketler")
    
    olusturulma_tarihi: datetime = Field(default_factory=datetime.utcnow)
    degistirilme_tarihi: datetime = Field(default_factory=datetime.utcnow)
    
    aktif_mi: bool = Field(default=True, description="Aktif durumu")
    silindi_mi: bool = Field(default=False, description="Soft delete için", index=True)
    
    class Settings:
        use_state_management = True
        validate_on_save = True
    
    def soft_delete(self):
        self.silindi_mi = True
        self.aktif_mi = False
        self.degistirilme_tarihi = datetime.utcnow()
    
    def activate(self):
        self.aktif_mi = True
        self.degistirilme_tarihi = datetime.utcnow()
    
    def deactivate(self):
        self.aktif_mi = False
        self.degistirilme_tarihi = datetime.utcnow()
    
    class Config:
        json_encoders = {
            ObjectId: str,
            datetime: lambda v: v.isoformat()
        }
