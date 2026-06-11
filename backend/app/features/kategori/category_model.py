from app.base.base_model import BaseModel
from pydantic import Field
from typing import Optional
from pymongo import IndexModel, ASCENDING


class Category(BaseModel):
    slug: str = Field(..., description="URL-friendly kategori adı", index=True)
    ikon: Optional[str] = Field(None, description="Kategori ikonu (emoji veya icon adı)")
    ust_kategori_id: Optional[str] = Field(None, description="Üst kategori ID (alt kategori için)")
    
    class Settings:
        name = "categories"
        use_state_management = True
        validate_on_save = True
        indexes = [
            IndexModel([("slug", ASCENDING)], unique=True),
            IndexModel([("kisa_ad", ASCENDING)], unique=True),
            IndexModel([("silindi_mi", ASCENDING)]),
            IndexModel([("aktif_mi", ASCENDING)]),
        ]
