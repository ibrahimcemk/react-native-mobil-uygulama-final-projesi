from typing import List, Dict, Any
from app.base import BaseRepo
from .project_model import Project


class ProjectRepo(BaseRepo[Project]):
    def __init__(self):
        super().__init__(Project)
    
    async def get_by_client(self, client_id: str) -> List[Project]:
        projects = await self.model.find(
            self.model.client_id == client_id,
            self.model.silindi_mi == False
        ).sort([("olusturulma_tarihi", -1)]).to_list()
        return projects
    
    async def get_by_freelancer(self, freelancer_id: str) -> List[Project]:
        projects = await self.model.find(
            self.model.secilen_freelancer_id == freelancer_id,
            self.model.silindi_mi == False
        ).sort([("olusturulma_tarihi", -1)]).to_list()
        return projects
    
    async def get_open_projects(self, kategori_id: str = None, limit: int = 50) -> List[Project]:
        query = {
            "durum": "open",
            "silindi_mi": False,
            "aktif_mi": True
        }
        
        if kategori_id:
            query["kategori_id"] = kategori_id
        
        projects = await self.model.find(query).sort([("olusturulma_tarihi", -1)]).limit(limit).to_list()
        return projects
