from typing import Dict, Any, List
from app.base import BaseManager
from .photo_repo import PhotoRepo
from .photo_model import Photo


class PhotoManager(BaseManager[Photo]):
    def __init__(self):
        self.repo = PhotoRepo()
        super().__init__(self.repo)
    
    async def create_photo(self, user_id: str, user_name: str, user_profile_img: str, image_url: str, data: Dict[str, Any]) -> Photo:
        
        photo_data = {
            "kullanici_id": user_id,
            "kullanici_adi": user_name,
            "kullanici_profil_resmi": user_profile_img,
            "resim_url": image_url,
            "baslik": data.get("baslik"),
            "konum": data.get("konum"),
            "herkese_acik": data.get("herkese_acik", True),
        }
        return await self.repo.create(photo_data)
    
    async def get_user_photos(self, user_id: str, skip: int = 0, limit: int = 20) -> List[Photo]:
        
        return await self.repo.get_user_photos(user_id, skip, limit)
    
    async def get_user_photo_count(self, user_id: str) -> int:
        
        return await self.repo.get_user_photo_count(user_id)
    
    async def increment_view(self, photo_id: str) -> bool:
        
        return await self.repo.increment_view(photo_id)
    
    async def delete_photo(self, photo_id: str, user_id: str) -> bool:
        
        photo = await self.repo.get_one(photo_id)
        if not photo:
            raise ValueError("Fotoğraf bulunamadı")
        
        if photo.kullanici_id != user_id:
            raise PermissionError("Bu fotoğrafı silme yetkiniz yok")
        
        photo.soft_delete()
        await photo.save()
        return True
    
    async def get_public_feed(self, skip: int = 0, limit: int = 20) -> List[Photo]:
       
        return await self.repo.get_public_photos(skip, limit)
    
    async def get_public_feed_count(self) -> int:
        
        return await self.repo.get_public_photo_count()
    
    async def get_user_public_photos(self, user_id: str, skip: int = 0, limit: int = 20) -> List[Photo]:
        
        return await self.repo.get_user_public_photos(user_id, skip, limit)
