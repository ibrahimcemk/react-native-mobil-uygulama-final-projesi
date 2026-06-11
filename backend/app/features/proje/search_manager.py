from typing import Optional, List, Dict
from .project_repo import ProjectRepo
from app.features.kullanici.user_repo import UserRepo


class SearchManager:
    
    def __init__(self):
        self.project_repo = ProjectRepo()
        self.user_repo = UserRepo()
    
    async def search_projects(
        self,
        search: Optional[str] = None,
        kategori_id: Optional[str] = None,
        beceriler: Optional[List[str]] = None,
        butce_min: Optional[float] = None,
        butce_max: Optional[float] = None,
        butce_tip: Optional[str] = None,
        durum: Optional[str] = None,
        sort_by: str = "olusturulma_tarihi",
        sort_order: int = -1,
        skip: int = 0,
        limit: int = 20
    ) -> Dict:
       
        filters = {
            "silindi_mi": False,
            "aktif_mi": True
        }
        
        if search:
            filters["$or"] = [
                {"baslik": {"$regex": search, "$options": "i"}},
                {"aciklama": {"$regex": search, "$options": "i"}},
                {"gerekli_beceriler": {"$regex": search, "$options": "i"}}
            ]
        
        if kategori_id:
            filters["kategori_id"] = kategori_id
        
        # Beceri filtresi - en az bir beceri eşleşmeli
        if beceriler and len(beceriler) > 0:
            filters["gerekli_beceriler"] = {"$in": beceriler}
        
        if butce_min is not None or butce_max is not None:
            butce_filter = {}
            if butce_min is not None:
                butce_filter["$gte"] = butce_min
            if butce_max is not None:
                butce_filter["$lte"] = butce_max
            
            filters["$or"] = filters.get("$or", []) + [
                {"butce_min": butce_filter},
                {"butce_max": butce_filter}
            ]
        
        if butce_tip:
            filters["butce_tip"] = butce_tip
        
        if durum:
            filters["durum"] = durum
        
        # Projeleri getir
        projects = await self.project_repo.model.find(
            filters
        ).sort([(sort_by, sort_order)]).skip(skip).limit(limit).to_list()
        
        total = await self.project_repo.model.find(filters).count()
        
        return {
            "projects": projects,
            "total": total,
            "skip": skip,
            "limit": limit
        }
    
    async def search_users(
        self,
        search: Optional[str] = None,
        rol: Optional[str] = None,
        beceriler: Optional[List[str]] = None,
        min_puan: Optional[float] = None,
        saatlik_ucret_min: Optional[float] = None,
        saatlik_ucret_max: Optional[float] = None,
        lokasyon: Optional[str] = None,
        sort_by: str = "ortalama_puan",
        sort_order: int = -1,
        skip: int = 0,
        limit: int = 20
    ) -> Dict:
        filters = {
            "silindi_mi": False,
            "aktif_mi": True
        }
        
       
        if search:
            filters["$or"] = [
                {"ad": {"$regex": search, "$options": "i"}},
                {"baslik": {"$regex": search, "$options": "i"}},
                {"bio": {"$regex": search, "$options": "i"}},
                {"beceriler": {"$regex": search, "$options": "i"}}
            ]
        
        if rol:
            filters["rol"] = rol
        
        if beceriler and len(beceriler) > 0:
            filters["beceriler"] = {"$in": beceriler}
        
        if min_puan is not None:
            filters["ortalama_puan"] = {"$gte": min_puan}
        
        if saatlik_ucret_min is not None or saatlik_ucret_max is not None:
            ucret_filter = {}
            if saatlik_ucret_min is not None:
                ucret_filter["$gte"] = saatlik_ucret_min
            if saatlik_ucret_max is not None:
                ucret_filter["$lte"] = saatlik_ucret_max
            filters["saatlik_ucret"] = ucret_filter
        
        if lokasyon:
            filters["lokasyon"] = {"$regex": lokasyon, "$options": "i"}
        
        users = await self.user_repo.model.find(
            filters
        ).sort([(sort_by, sort_order)]).skip(skip).limit(limit).to_list()
        
        total = await self.user_repo.model.find(filters).count()
        
        return {
            "users": users,
            "total": total,
            "skip": skip,
            "limit": limit
        }
