from app.base.base_model import BaseModel
from pydantic import Field
from typing import Optional
from pymongo import IndexModel, ASCENDING, DESCENDING


class Proposal(BaseModel):
    proje_id: str = Field(..., description="Proje ID")
    freelancer_id: str = Field(..., description="Teklif veren freelancer ID")
    
    teklif_tutari: float = Field(..., description="Teklif tutarı")
    teslim_suresi_gun: int = Field(..., description="Teslim süresi (gün)")
    
    cover_letter: Optional[str] = Field(None, description="Başvuru mektubu / Açıklama")
    
    durum: str = Field(default="pending", description="Durum: pending, accepted, rejected, withdrawn")
    
    class Settings:
        name = "proposals"
        use_state_management = True
        validate_on_save = True
        indexes = [
            IndexModel([("proje_id", ASCENDING)]),
            IndexModel([("freelancer_id", ASCENDING)]),
            IndexModel([("durum", ASCENDING)]),
            IndexModel([("silindi_mi", ASCENDING)]),
            IndexModel([("olusturulma_tarihi", DESCENDING)]),
            IndexModel([("proje_id", ASCENDING), ("freelancer_id", ASCENDING)], unique=True),
        ]
