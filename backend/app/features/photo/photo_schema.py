from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class PhotoSchema(BaseModel):
    id: Optional[str] = None
    kullanici_id: str
    kullanici_adi: Optional[str] = None
    kullanici_profil_resmi: Optional[str] = None
    resim_url: str
    baslik: Optional[str] = None
    konum: Optional[str] = None
    goruntulenme: int = 0
    begeni_sayisi: int = 0
    begenenler: list = []
    yorum_sayisi: int = 0
    herkese_acik: bool = True
    olusturulma_tarihi: Optional[datetime] = None
    degistirilme_tarihi: Optional[datetime] = None
    aktif_mi: bool = True
    silindi_mi: bool = False
    
    model_config = {"from_attributes": True}



class PhotoCreateSchema(BaseModel):
    baslik: Optional[str] = None
    konum: Optional[str] = None
    herkese_acik: bool = True


class PhotoUpdateSchema(BaseModel):
    baslik: Optional[str] = None
    konum: Optional[str] = None
    begeni_sayisi: Optional[int] = None
    yorum_sayisi: Optional[int] = None
    herkese_acik: Optional[bool] = None
