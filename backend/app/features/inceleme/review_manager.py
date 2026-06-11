from typing import Dict, Any, List
from app.base import BaseManager
from .review_repo import ReviewRepo
from .review_model import Review


class ReviewManager(BaseManager[Review]):
    def __init__(self):
        self.repo = ReviewRepo()
        super().__init__(self.repo)
    
    async def create_review(self, degerlendiren_id: str, proje_id: str, data: Dict[str, Any]) -> Review:
    
        from app.features.proje.project_repo import ProjectRepo
        from app.features.kullanici.user_repo import UserRepo
        
        project_repo = ProjectRepo()
        project = await project_repo.get_one(proje_id)
        
        if project.durum != "completed":
            raise ValueError("Sadece tamamlanmış projeler için inceleme yapılabilir")
        
        existing = await self.repo.check_existing_review(proje_id, degerlendiren_id)
        if existing:
            raise ValueError("Bu proje için zaten inceleme yaptınız")
        
        is_client = project.client_id == degerlendiren_id
        is_freelancer = project.secilen_freelancer_id == degerlendiren_id
        
        if not is_client and not is_freelancer:
            raise ValueError("Bu projeyle ilgili değilsiniz")
        
        if is_client:
            degerlendirilen_id = project.secilen_freelancer_id
        else:
            degerlendirilen_id = project.client_id
        
        if not degerlendirilen_id:
            raise ValueError("Değerlendirilecek kullanıcı bulunamadı")
        
        data["degerlendiren_id"] = degerlendiren_id
        data["degerlendirilen_id"] = degerlendirilen_id
        data["proje_id"] = proje_id
        
        review = await self.repo.create(data)
        
        stats = await self.repo.calculate_user_average(degerlendirilen_id)
        user_repo = UserRepo()
        await user_repo.update(degerlendirilen_id, {
            "ortalama_puan": stats["ortalama_puan"],
            "toplam_inceleme": stats["toplam_inceleme"]
        })
        
        if is_freelancer:
            user = await user_repo.get_one(degerlendiren_id)
            if user:
                await user_repo.update(degerlendiren_id, {
                    "tamamlanan_is_sayisi": user.tamamlanan_is_sayisi + 1
                })
        
        return review
    
    async def get_user_reviews(self, user_id: str) -> List[Review]:
        """Kullanıcı hakkındaki incelemeleri getir"""
        return await self.repo.get_by_user(user_id)
    
    async def get_project_reviews(self, proje_id: str) -> List[Review]:
        """Projeye ait incelemeleri getir"""
        return await self.repo.get_by_project(proje_id)
    
    async def calculate_user_stats(self, user_id: str) -> Dict[str, Any]:
        """Kullanıcının istatistiklerini hesapla"""
        return await self.repo.calculate_user_average(user_id)
