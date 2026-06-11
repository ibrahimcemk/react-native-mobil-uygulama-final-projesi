from fastapi import APIRouter, Query, Depends
from typing import Optional, List
from app.core.response import success_response, error_response
from app.core.security import get_current_user
from .search_manager import SearchManager


search_router = APIRouter(prefix="/search", tags=["search"])


def project_to_dict(project) -> dict:
    return {
        "id": str(project.id),
        "ad": project.ad,
        "baslik": project.baslik,
        "aciklama": project.aciklama,
        "client_id": project.client_id,
        "kategori_id": project.kategori_id,
        "gerekli_beceriler": project.gerekli_beceriler,
        "butce_tip": project.butce_tip,
        "butce_min": project.butce_min,
        "butce_max": project.butce_max,
        "sure_gun": project.sure_gun,
        "durum": project.durum,
        "teklif_sayisi": project.teklif_sayisi,
        "olusturulma_tarihi": project.olusturulma_tarihi.isoformat() if project.olusturulma_tarihi else None,
    }


def user_to_dict(user) -> dict:
    return {
        "id": str(user.id),
        "ad": user.ad,
        "email": user.email,
        "rol": user.rol,
        "baslik": user.baslik,
        "bio": user.bio,
        "beceriler": user.beceriler,
        "saatlik_ucret": user.saatlik_ucret,
        "lokasyon": user.lokasyon,
        "profil_resmi": user.profil_resmi,
        "ortalama_puan": user.ortalama_puan,
        "toplam_inceleme": user.toplam_inceleme,
        "tamamlanan_is_sayisi": user.tamamlanan_is_sayisi,
    }


@search_router.get("/projects")
async def search_projects(
    search: Optional[str] = Query(None, description="Arama metni (başlık, açıklama, beceriler)"),
    kategori_id: Optional[str] = Query(None, description="Kategori ID"),
    beceriler: Optional[str] = Query(None, description="Beceriler (virgülle ayrılmış)"),
    butce_min: Optional[float] = Query(None, description="Minimum bütçe"),
    butce_max: Optional[float] = Query(None, description="Maximum bütçe"),
    butce_tip: Optional[str] = Query(None, description="Bütçe tipi (fixed, hourly)"),
    durum: Optional[str] = Query(None, description="Proje durumu (open, in_progress, completed, cancelled)"),
    sort_by: str = Query("olusturulma_tarihi", description="Sıralama alanı"),
    sort_order: int = Query(-1, description="Sıralama yönü (-1: azalan, 1: artan)"),
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    current_user = Depends(get_current_user)
):
   
    try:
        print(f"🔍 Search Projects - Params: search={search}, kategori={kategori_id}, butce={butce_min}-{butce_max}, durum={durum}")
        manager = SearchManager()
        
        
        beceri_listesi = None
        if beceriler:
            beceri_listesi = [b.strip() for b in beceriler.split(',') if b.strip()]
        
        result = await manager.search_projects(
            search=search,
            kategori_id=kategori_id,
            beceriler=beceri_listesi,
            butce_min=butce_min,
            butce_max=butce_max,
            butce_tip=butce_tip,
            durum=durum,
            sort_by=sort_by,
            sort_order=sort_order,
            skip=skip,
            limit=limit
        )
        
        print(f"✅ {result['total']} proje bulundu, {len(result['projects'])} tanesi döndürülüyor")
        return success_response(
            data={
                "projects": [project_to_dict(p) for p in result["projects"]],
                "total": result["total"],
                "skip": result["skip"],
                "limit": result["limit"]
            },
            message="Projeler getirildi"
        )
        
    except Exception as e:
        import traceback
        print(f"❌ Search Projects Error: {str(e)}")
        print(f"🔍 Traceback:\n{traceback.format_exc()}")
        return error_response(str(e), 400)


@search_router.get("/users")
async def search_users(
    search: Optional[str] = Query(None, description="Arama metni (ad, başlık, bio, beceriler)"),
    rol: Optional[str] = Query(None, description="Kullanıcı rolü (freelancer, client)"),
    beceriler: Optional[str] = Query(None, description="Beceriler (virgülle ayrılmış)"),
    min_puan: Optional[float] = Query(None, description="Minimum ortalama puan", ge=0, le=5),
    saatlik_ucret_min: Optional[float] = Query(None, description="Minimum saatlik ücret"),
    saatlik_ucret_max: Optional[float] = Query(None, description="Maximum saatlik ücret"),
    lokasyon: Optional[str] = Query(None, description="Lokasyon"),
    sort_by: str = Query("ortalama_puan", description="Sıralama alanı"),
    sort_order: int = Query(-1, description="Sıralama yönü (-1: azalan, 1: artan)"),
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    current_user = Depends(get_current_user)
):
 
    try:
        print(f"🔍 Search Users - Params: search={search}, rol={rol}, min_puan={min_puan}, ucret={saatlik_ucret_min}-{saatlik_ucret_max}")
        manager = SearchManager()
        
        beceri_listesi = None
        if beceriler:
            beceri_listesi = [b.strip() for b in beceriler.split(',') if b.strip()]
        
        result = await manager.search_users(
            search=search,
            rol=rol,
            beceriler=beceri_listesi,
            min_puan=min_puan,
            saatlik_ucret_min=saatlik_ucret_min,
            saatlik_ucret_max=saatlik_ucret_max,
            lokasyon=lokasyon,
            sort_by=sort_by,
            sort_order=sort_order,
            skip=skip,
            limit=limit
        )
        
        print(f"✅ {result['total']} kullanıcı bulundu, {len(result['users'])} tanesi döndürülüyor")
        return success_response(
            data={
                "users": [user_to_dict(u) for u in result["users"]],
                "total": result["total"],
                "skip": result["skip"],
                "limit": result["limit"]
            },
            message="Kullanıcılar getirildi"
        )
        
    except Exception as e:
        import traceback
        print(f"❌ Search Users Error: {str(e)}")
        print(f"🔍 Traceback:\n{traceback.format_exc()}")
        return error_response(str(e), 400)
