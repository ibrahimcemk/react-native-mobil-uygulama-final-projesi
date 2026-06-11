from typing import List
from .comment_model import PhotoComment


class CommentRepo:
    def __init__(self):
        self.model = PhotoComment
    
    async def create(self, data: dict) -> PhotoComment:
        
        comment = PhotoComment(**data)
        await comment.insert()
        return comment
    
    async def get_photo_comments(self, photo_id: str, skip: int = 0, limit: int = 50) -> List[PhotoComment]:
        
        comments = await self.model.find(
            self.model.photo_id == photo_id,
            self.model.silindi_mi == False
        ).sort(-self.model.olusturulma_tarihi).skip(skip).limit(limit).to_list()
        return comments
    
    async def get_comment_count(self, photo_id: str) -> int:
        
        count = await self.model.find(
            self.model.photo_id == photo_id,
            self.model.silindi_mi == False
        ).count()
        return count
    
    async def get_one(self, comment_id: str) -> PhotoComment:
        
        return await self.model.get(comment_id)
    
    async def delete_comment(self, comment_id: str) -> bool:
       
        comment = await self.get_one(comment_id)
        if comment:
            comment.silindi_mi = True
            await comment.save()
            return True
        return False
