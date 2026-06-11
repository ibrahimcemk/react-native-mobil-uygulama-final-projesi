from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional, List
from bson import ObjectId


class BaseSchema(BaseModel):
    ad: str = Field(..., min_length=1, max_length=200)
    kisa_ad: Optional[str] = Field(None, max_length=50)
    aciklama: Optional[str] = None
    etiketler: List[str] = Field(default_factory=list)
    
    class Config:
        json_encoders = {
            ObjectId: str,
            datetime: lambda v: v.isoformat()
        }


class BaseResponseSchema(BaseSchema):
    id: str
    olusturulma_tarihi: datetime
    degistirilme_tarihi: datetime
    aktif_mi: bool
    silindi_mi: bool
    
    class Config:
        from_attributes = True


class BasePatchSchema(BaseModel):
    ad: Optional[str] = Field(None, min_length=1, max_length=200)
    kisa_ad: Optional[str] = Field(None, max_length=50)
    aciklama: Optional[str] = None
    etiketler: Optional[List[str]] = None
    aktif_mi: Optional[bool] = None


class PaginatedResponse(BaseModel):
    data: List[BaseResponseSchema]
    total: int
    page: int
    limit: int
    toplam_sayfa: int
    
    class Config:
        from_attributes = True
