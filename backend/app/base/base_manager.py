from typing import TypeVar, Generic, Optional, Dict, Any
from .base_repo import BaseRepo


T = TypeVar('T')


class BaseManager(Generic[T]):
    def __init__(self, repo: BaseRepo[T]):
        self.repo = repo
    
    async def get_one(self, id: str) -> Optional[T]:
        obj = await self.repo.get_one(id)
        if not obj:
            raise ValueError(f"ID {id}  ile kayıt bulunamadı")
        return obj
     
     
    async def get_many(
        self,
        filters: Dict[str, Any] = None,
        sort_by: str = "olusturulma_tarihi",
        sort_order: int = -1,
        page: int = 1,
        limit: int = 10
    ) -> Dict[str, Any]:
        return await self.repo.get_many(
            filters=filters,
            sort_by=sort_by,
            sort_order=sort_order,
            page=page,
            limit=limit
        )
    
    async def create(self, data: Dict[str, Any]) -> T:
        return await self.repo.create(data)
    
    async def update(self, id: str, data: Dict[str, Any]) -> T:
        obj = await self.repo.update(id, data)
        if not obj:
            raise ValueError(f"ID {id} ile kayıt bulunamadı")
        return obj
    
    async def patch(self, id: str, data: Dict[str, Any]) -> T:
        obj = await self.repo.patch(id, data)
        if not obj:
            raise ValueError(f"ID {id} ile kayıt bulunamadı")
        return obj
    
    async def soft_delete(self, id: str) -> bool:
        success = await self.repo.soft_delete(id)
        if not success:
            raise ValueError(f"ID {id} ile kayıt bulunamadı")
        return success
    
    async def hard_delete(self, id: str) -> bool:
        success = await self.repo.hard_delete(id)
        if not success:
            raise ValueError(f"ID {id} ile kayıt bulunamadı")
        return success
    
    async def activate(self, id: str) -> T:
        obj = await self.repo.activate(id)
        if not obj:
            raise ValueError(f"ID {id} ile kayıt bulunamadı")
        return obj
    
    async def deactivate(self, id: str) -> T:
        obj = await self.repo.deactivate(id)
        if not obj:
            raise ValueError(f"ID {id} ile kayıt bulunamadı")
        return obj
