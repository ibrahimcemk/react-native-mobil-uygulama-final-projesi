from pydantic import Field
from typing import Optional
from app.base.base_schema import BaseSchema, BaseResponseSchema, BasePatchSchema


class ReviewCreateSchema(BaseSchema):
    puan: float = Field(..., ge=1, le=5, description="Genel puan (1-5)")
    yorum: Optional[str] = Field(None, description="Yorum")
    iletisim_puani: Optional[float] = Field(None, ge=1, le=5)
    kalite_puani: Optional[float] = Field(None, ge=1, le=5)
    sure_puani: Optional[float] = Field(None, ge=1, le=5)


class ReviewResponseSchema(BaseResponseSchema):
    proje_id: str
    degerlendiren_id: str
    degerlendirilen_id: str
    puan: float
    yorum: Optional[str] = None
    iletisim_puani: Optional[float] = None
    kalite_puani: Optional[float] = None
    sure_puani: Optional[float] = None
    
    degerlendiren_ad: Optional[str] = None
    degerlendirilen_ad: Optional[str] = None
    proje_baslik: Optional[str] = None


class ReviewPatchSchema(BasePatchSchema):
    puan: Optional[float] = Field(None, ge=1, le=5)
    yorum: Optional[str] = None
    iletisim_puani: Optional[float] = Field(None, ge=1, le=5)
    kalite_puani: Optional[float] = Field(None, ge=1, le=5)
    sure_puani: Optional[float] = Field(None, ge=1, le=5)
