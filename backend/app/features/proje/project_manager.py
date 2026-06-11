from typing import Dict, Any, List
from datetime import datetime
from app.base import BaseManager
from .project_repo import ProjectRepo
from .project_model import Project


class ProjectManager(BaseManager[Project]):
    def __init__(self):
        self.repo = ProjectRepo()
        super().__init__(self.repo)
    
    async def create_project(self, client_id: str, data: Dict[str, Any]) -> Project:
        data["client_id"] = client_id
        data["durum"] = "open"
        data["teklif_sayisi"] = 0
        
        if data.get("butce_tip") not in ["fixed", "hourly"]:
            raise ValueError("Bütçe tipi 'fixed' veya 'hourly' olmalıdır")
        
        return await self.repo.create(data)
    
    async def get_client_projects(self, client_id: str) -> List[Project]:
        return await self.repo.get_by_client(client_id)
    
    async def get_freelancer_projects(self, freelancer_id: str) -> List[Project]:
        return await self.repo.get_by_freelancer(freelancer_id)
    
    async def get_open_projects(self, kategori_id: str = None) -> List[Project]:
        return await self.repo.get_open_projects(kategori_id)
    
    async def select_freelancer(self, project_id: str, freelancer_id: str, client_id: str) -> Project:
        project = await self.get_one(project_id)
        
        if project.client_id != client_id:
            raise ValueError("Bu projeyi sadece sahibi güncelleyebilir")
        
        if project.durum != "open":
            raise ValueError("Sadece açık projeler için freelancer seçilebilir")
        
        update_data = {
            "secilen_freelancer_id": freelancer_id,
            "durum": "in_progress"
        }
        
        return await self.repo.update(project_id, update_data)
    
    async def complete_project(self, project_id: str, user_id: str, user_role: str) -> Project:
        project = await self.get_one(project_id)
        
        if user_role == "client" and project.client_id != user_id:
            raise ValueError("Bu projeyi sadece sahibi tamamlayabilir")
        
        if user_role == "freelancer" and project.secilen_freelancer_id != user_id:
            raise ValueError("Bu projeyi sadece atanan freelancer tamamlayabilir")
        
        if project.durum != "in_progress":
            raise ValueError("Sadece devam eden projeler tamamlanabilir")
        
        update_data = {
            "durum": "completed",
            "tamamlanma_tarihi": datetime.utcnow()
        }
        
        return await self.repo.update(project_id, update_data)
    
    async def cancel_project(self, project_id: str, client_id: str) -> Project:
        project = await self.get_one(project_id)
        
        if project.client_id != client_id:
            raise ValueError("Bu projeyi sadece sahibi iptal edebilir")
        
        if project.durum == "completed":
            raise ValueError("Tamamlanmış proje iptal edilemez")
        
        update_data = {"durum": "cancelled"}
        
        return await self.repo.update(project_id, update_data)
