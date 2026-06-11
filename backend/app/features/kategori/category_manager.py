from typing import Dict, Any, List
from app.base import BaseManager
from .category_repo import CategoryRepo
from .category_model import Category


class CategoryManager(BaseManager[Category]):
    def __init__(self):
        self.repo = CategoryRepo()
        super().__init__(self.repo)
    
    async def get_root_categories(self) -> List[Category]:
        """Üst kategorileri getir"""
        return await self.repo.get_root_categories()
    
    async def get_subcategories(self, parent_id: str) -> List[Category]:
        """Alt kategorileri getir"""
        return await self.repo.get_subcategories(parent_id)
    
    async def create_category(self, data: Dict[str, Any]) -> Category:
        """Yeni kategori oluştur"""
        if data.get("ust_kategori_id"):
            parent = await self.repo.get_one(data["ust_kategori_id"])
            if not parent:
                raise ValueError("Üst kategori bulunamadı")
        
        return await self.repo.create(data)
