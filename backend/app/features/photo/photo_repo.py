from typing import List
from app.base import BaseRepo
from .photo_model import Photo


class PhotoRepo(BaseRepo[Photo]):
    def __init__(self):
        super().__init__(Photo)
    
    async def get_user_photos(self, user_id: str, skip: int = 0, limit: int = 20) -> List[Photo]:
       
        photos = await self.model.find(
            self.model.kullanici_id == user_id,
            self.model.silindi_mi == False,
            self.model.aktif_mi == True
        ).sort(-self.model.olusturulma_tarihi).skip(skip).limit(limit).to_list()
        return photos
    
    async def get_user_photo_count(self, user_id: str) -> int:
       
        count = await self.model.find(
            self.model.kullanici_id == user_id,
            self.model.silindi_mi == False
        ).count()
        return count
    
    async def increment_view(self, photo_id: str) -> bool:
       
        photo = await self.get_one(photo_id)
        if photo:
            photo.goruntulenme += 1
            await photo.save()
            return True
        return False
    
    async def get_public_photos(self, skip: int = 0, limit: int = 20) -> List[Photo]:
       
        photos = await self.model.find(
            self.model.herkese_acik == True,
            self.model.silindi_mi == False,
            self.model.aktif_mi == True
        ).sort(-self.model.olusturulma_tarihi).skip(skip).limit(limit).to_list()
        return photos
        
    async def get_public_photo_count(self) -> int:
       
        count = await self.model.find(
            self.model.herkese_acik == True,
            self.model.silindi_mi == False
        ).count()
        return count
    
    async def get_user_public_photos(self, user_id: str, skip: int = 0, limit: int = 20) -> List[Photo]:
       
        photos = await self.model.find(
            self.model.kullanici_id == user_id,
            self.model.herkese_acik == True,
            self.model.silindi_mi == False,
            self.model.aktif_mi == True
        ).sort(-self.model.olusturulma_tarihi).skip(skip).limit(limit).to_list()
        return photos
    
    async def toggle_like(self, photo_id: str, user_id: str) -> dict:
       
        photo = await self.get_one(photo_id)
        if not photo:
            return {"success": False, "message": "Fotoğraf bulunamadı"}
        
        if user_id in photo.begenenler:
            photo.begenenler.remove(user_id)
            photo.begeni_sayisi = max(0, photo.begeni_sayisi - 1)
            await photo.save()
            return {"success": True, "liked": False, "count": photo.begeni_sayisi}
        else:
            photo.begenenler.append(user_id)
            photo.begeni_sayisi += 1
            await photo.save()
            return {"success": True, "liked": True, "count": photo.begeni_sayisi}
    
    async def increment_comment_count(self, photo_id: str) -> bool:
       
        photo = await self.get_one(photo_id)
        if photo:
            photo.yorum_sayisi += 1
            await photo.save()
            return True
        return False
    
    async def decrement_comment_count(self, photo_id: str) -> bool:
       
        photo = await self.get_one(photo_id)
        if photo:
            photo.yorum_sayisi = max(0, photo.yorum_sayisi - 1)
            await photo.save()
            return True
        return False
