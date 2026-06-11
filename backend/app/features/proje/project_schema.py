from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from app.base.base_schema import BaseSchema, BaseResponseSchema, BasePatchSchema


class ProjectCreateSchema(BaseSchema):
    baslik: str = Field(..., description="İş ilanı başlığı")
    kategori_id: str = Field(..., description="Kategori ID")
    gerekli_beceriler: List[str] = Field(default_factory=list)
    butce_tip: str = Field(default="fixed", description="fixed veya hourly")
    butce_min: Optional[float] = None
    butce_max: Optional[float] = None
    sure_gun: Optional[int] = None
    son_basvuru_tarihi: Optional[datetime] = None


class ProjectResponseSchema(BaseResponseSchema):
    baslik: str
    client_id: str
    kategori_id: str
    gerekli_beceriler: List[str] = []
    butce_tip: str
    butce_min: Optional[float] = None
    butce_max: Optional[float] = None
    sure_gun: Optional[int] = None
    son_basvuru_tarihi: Optional[datetime] = None
    durum: str
    secilen_freelancer_id: Optional[str] = None
    teklif_sayisi: int = 0
    tamamlanma_tarihi: Optional[datetime] = None
    
    client_ad: Optional[str] = None
    kategori_ad: Optional[str] = None


class ProjectPatchSchema(BasePatchSchema):
    baslik: Optional[str] = None
    kategori_id: Optional[str] = None
    gerekli_beceriler: Optional[List[str]] = None
    butce_tip: Optional[str] = None
    butce_min: Optional[float] = None
    butce_max: Optional[float] = None
    sure_gun: Optional[int] = None
    son_basvuru_tarihi: Optional[datetime] = None
    durum: Optional[str] = None
    secilen_freelancer_id: Optional[str] = None
