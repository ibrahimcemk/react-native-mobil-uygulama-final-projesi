from typing import List, Optional, Dict, Any
from app.base import BaseRepo
from .review_model import Review


class ReviewRepo(BaseRepo[Review]):
    def __init__(self):
        super().__init__(Review)
    
    async def get_by_user(self, user_id: str) -> List[Review]:
        """Kullanıcı hakkındaki incelemeler"""
        reviews = await self.model.find(
            self.model.degerlendirilen_id == user_id,
            self.model.silindi_mi == False
        ).sort([("olusturulma_tarihi", -1)]).to_list()
        return reviews
    
    async def get_by_project(self, proje_id: str) -> List[Review]:
        """Projeye ait incelemeler"""
        reviews = await self.model.find(
            self.model.proje_id == proje_id,
            self.model.silindi_mi == False
        ).to_list()
        return reviews
    
    async def check_existing_review(self, proje_id: str, degerlendiren_id: str) -> Optional[Review]:
        """Kullanıcı bu proje için zaten inceleme yapmış mı?"""
        review = await self.model.find_one(
            self.model.proje_id == proje_id,
            self.model.degerlendiren_id == degerlendiren_id,
            self.model.silindi_mi == False
        )
        return review
    
    async def calculate_user_average(self, user_id: str) -> Dict[str, Any]:
        """Kullanıcının ortalama puanını hesapla"""
        pipeline = [
            {"$match": {"degerlendirilen_id": user_id, "silindi_mi": False}},
            {"$group": {
                "_id": None,
                "ortalama_puan": {"$avg": "$puan"},
                "toplam_inceleme": {"$sum": 1}
            }}
        ]
        
        result = await self.model.get_motor_collection().aggregate(pipeline).to_list(1)
        
        if result:
            return {
                "ortalama_puan": round(result[0]["ortalama_puan"], 2),
                "toplam_inceleme": result[0]["toplam_inceleme"]
            }
        
        return {"ortalama_puan": 0.0, "toplam_inceleme": 0}
