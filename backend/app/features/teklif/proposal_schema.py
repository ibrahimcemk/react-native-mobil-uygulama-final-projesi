from pydantic import BaseModel, Field
from typing import Optional
from app.base.base_schema import BaseResponseSchema, BasePatchSchema


class ProposalCreateSchema(BaseModel):
    teklif_tutari: float = Field(..., description="Teklif tutarı")
    teslim_suresi_gun: int = Field(..., description="Teslim süresi (gün)")
    cover_letter: Optional[str] = Field(None, description="Başvuru mektubu")


class ProposalResponseSchema(BaseResponseSchema):
    proje_id: str
    freelancer_id: str
    teklif_tutari: float
    teslim_suresi_gun: int
    cover_letter: Optional[str] = None
    durum: str
    
    freelancer_ad: Optional[str] = None
    freelancer_baslik: Optional[str] = None
    freelancer_ortalama_puan: Optional[float] = None
    proje_baslik: Optional[str] = None


class ProposalPatchSchema(BasePatchSchema):
    teklif_tutari: Optional[float] = None
    teslim_suresi_gun: Optional[int] = None
    cover_letter: Optional[str] = None
    durum: Optional[str] = None
