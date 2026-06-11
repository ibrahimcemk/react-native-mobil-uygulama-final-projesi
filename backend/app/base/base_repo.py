from typing import TypeVar, Generic, List, Optional, Dict, Any
from datetime import datetime
from beanie import Document
from pymongo import ASCENDING, DESCENDING
from bson import ObjectId


T = TypeVar('T', bound=Document)


class BaseRepo(Generic[T]):
    def __init__(self, model: type[T]):
        self.model = model
    
    async def get_one(self, id: str) -> Optional[T]:
        if not ObjectId.is_valid(id):
            return None
        obj = await self.model.get(id)
        if obj and not obj.silindi_mi:
            return obj
        return None
    
    async def get_many(
        self,
        filters: Dict[str, Any] = None,
        sort_by: str = "olusturulma_tarihi",
        sort_order: int = DESCENDING,
        page: int = 1,
        limit: int = 10,
        include_deleted: bool = False
    ) -> Dict[str, Any]:
        query = dict(filters) if filters else {}
        
        if not include_deleted:
            query["silindi_mi"] = False
        
        skip = (page - 1) * limit
        
        total = await self.model.find(query).count()
        
        data = await self.model.find(query)\
            .sort([(sort_by, sort_order)])\
            .skip(skip)\
            .limit(limit)\
            .to_list()
        
        return {
            "data": data,
            "total": total,
            "page": page,
            "limit": limit,
            "toplam_sayfa": (total + limit - 1) // limit
        }
    
    async def create(self, data: Dict[str, Any]) -> T:
        obj = self.model(**data)
        await obj.insert()
        return obj
    
    async def update(self, id: str, data: Dict[str, Any]) -> Optional[T]:
        obj = await self.get_one(id)
        if not obj:
            return None
        
        for key, value in data.items():
            if hasattr(obj, key):
                setattr(obj, key, value)
        
        obj.degistirilme_tarihi = datetime.utcnow()
        await obj.save()
        return obj
    
    async def patch(self, id: str, data: Dict[str, Any]) -> Optional[T]:
        return await self.update(id, data)
    
    async def soft_delete(self, id: str) -> bool:
        obj = await self.get_one(id)
        if not obj:
            return False
        
        obj.soft_delete()
        await obj.save()
        return True
    
    async def soft_delete_cascade(self, id: str, cascade_repos: List = None) -> bool:
        success = await self.soft_delete(id)
        
        if success and cascade_repos:
            for repo_info in cascade_repos:
                repo = repo_info["repo"]
                foreign_key = repo_info["foreign_key"]
                
                children = await repo.model.find({foreign_key: id, "silindi_mi": False}).to_list()
                for child in children:
                    child.soft_delete()
                    await child.save()
        
        return success
    
    async def hard_delete(self, id: str) -> bool:
        obj = await self.model.get(id)
        if not obj:
            return False
        
        await obj.delete()
        return True
    
    async def hard_delete_cascade(self, id: str, cascade_repos: List = None) -> bool:
        if cascade_repos:
            for repo_info in cascade_repos:
                repo = repo_info["repo"]
                foreign_key = repo_info["foreign_key"]
                
                children = await repo.model.find({foreign_key: id}).to_list()
                for child in children:
                    await child.delete()
        
        return await self.hard_delete(id)
    
    async def activate(self, id: str) -> Optional[T]:
        obj = await self.get_one(id)
        if not obj:
            return None
        
        obj.activate()
        await obj.save()
        return obj
    
    async def deactivate(self, id: str) -> Optional[T]:
        obj = await self.get_one(id)
        if not obj:
            return None
        
        obj.deactivate()
        await obj.save()
        return obj
