from pydantic import Field
from typing import Optional
from app.base.base_schema import BaseSchema, BaseResponseSchema, BasePatchSchema


class CategoryCreateSchema(BaseSchema):
    ikon: Optional[str] = Field(None, description="Kategori ikonu")
    ust_kategori_id: Optional[str] = Field(None, description="Üst kategori ID")


class CategoryResponseSchema(BaseResponseSchema):
    ikon: Optional[str] = None
    ust_kategori_id: Optional[str] = None


class CategoryPatchSchema(BasePatchSchema):
    ikon: Optional[str] = None
    ust_kategori_id: Optional[str] = None
