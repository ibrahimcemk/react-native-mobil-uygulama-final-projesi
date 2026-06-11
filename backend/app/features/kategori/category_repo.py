from typing import Optional, List
from app.base import BaseRepo
from .category_model import Category


class CategoryRepo(BaseRepo[Category]):
    def __init__(self):
        super().__init__(Category)
    
    async def get_root_categories(self) -> List[Category]:
        """Üst kategorileri getir (ust_kategori_id = None)"""
        categories = await self.model.find(
            self.model.ust_kategori_id == None,
            self.model.silindi_mi == False,
            self.model.aktif_mi == True
        ).to_list()
        return categories
    
    async def get_subcategories(self, parent_id: str) -> List[Category]:
        """Belirtilen kategorinin alt kategorilerini getir"""
        categories = await self.model.find(
            self.model.ust_kategori_id == parent_id,
            self.model.silindi_mi == False,
            self.model.aktif_mi == True
        ).to_list()
        return categories
