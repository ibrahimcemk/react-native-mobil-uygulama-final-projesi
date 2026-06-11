from app.base.base_model import BaseModel
from pydantic import Field
from typing import Optional, List
from datetime import datetime
from pymongo import IndexModel, ASCENDING, DESCENDING


class Project(BaseModel):
    baslik: str = Field(..., description="İş ilanı başlığı")
    client_id: str = Field(..., description="İşi açan client kullanıcı ID")
    kategori_id: str = Field(..., description="Kategori ID")
    
    gerekli_beceriler: List[str] = Field(default_factory=list, description="Gerekli beceriler")
    
    butce_tip: str = Field(default="fixed", description="Bütçe tipi: fixed (sabit) veya hourly (saatlik)")
    butce_min: Optional[float] = Field(None, description="Minimum bütçe")
    butce_max: Optional[float] = Field(None, description="Maximum bütçe")
    
    sure_gun: Optional[int] = Field(None, description="Tahmini süre (gün)")
    son_basvuru_tarihi: Optional[datetime] = Field(None, description="Son başvuru tarihi")
    
    durum: str = Field(default="open", description="Durum: open, in_progress, completed, cancelled")
    
    secilen_freelancer_id: Optional[str] = Field(None, description="Seçilen freelancer ID")
    teklif_sayisi: int = Field(default=0, description="Gelen teklif sayısı")
    
    tamamlanma_tarihi: Optional[datetime] = Field(None, description="İşin tamamlandığı tarih")
    
    class Settings:
        name = "projects"
        use_state_management = True
        validate_on_save = True
        indexes = [
            IndexModel([("client_id", ASCENDING)]),
            IndexModel([("kategori_id", ASCENDING)]),
            IndexModel([("durum", ASCENDING)]),
            IndexModel([("silindi_mi", ASCENDING)]),
            IndexModel([("olusturulma_tarihi", DESCENDING)]),
            IndexModel([("secilen_freelancer_id", ASCENDING)]),
        ]
