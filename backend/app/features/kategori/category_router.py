from typing import Optional
from fastapi import APIRouter, HTTPException, Depends, status, Query
from app.core import success_response, paginated_response
from .category_schema import CategoryCreateSchema, CategoryResponseSchema, CategoryPatchSchema
from .category_manager import CategoryManager
from app.features.kullanici.user_router import get_current_user


router = APIRouter(prefix="/categories", tags=["Kategoriler"])
category_manager = CategoryManager()


@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_category(data: CategoryCreateSchema, current_user = Depends(get_current_user)):
    if current_user.rol != 'admin':
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Bu işlem için admin yetkisi gerekli"
        )
    
    try:
        category = await category_manager.create_category(data.model_dump())
        category_dict = category.model_dump()
        category_dict["id"] = str(category.id)
        
        return success_response(
            data=category_dict,
            message="Kategori oluşturuldu"
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@router.get("/")
async def get_categories(
    page: int = Query(1, ge=1),
    limit: int = Query(50, ge=1, le=100),
    ust_kategori_id: Optional[str] = Query(None)
):
    if ust_kategori_id == "null":
        categories = await category_manager.get_root_categories()
        categories_data = []
        for cat in categories:
            cat_dict = cat.model_dump()
            cat_dict["id"] = str(cat.id)
            categories_data.append(cat_dict)
        
        return success_response(
            data=categories_data,
            message="Ana kategoriler listelendi"
        )
    elif ust_kategori_id:
        categories = await category_manager.get_subcategories(ust_kategori_id)
        categories_data = []
        for cat in categories:
            cat_dict = cat.model_dump()
            cat_dict["id"] = str(cat.id)
            categories_data.append(cat_dict)
        
        return success_response(
            data=categories_data,
            message="Alt kategoriler listelendi"
        )
    else:
        filters = {}
        result = await category_manager.get_many(
            filters=filters,
            page=page,
            limit=limit,
            sort_by="ad"
        )
        
        categories_data = []
        for cat in result["data"]:
            cat_dict = cat.model_dump()
            cat_dict["id"] = str(cat.id)
            categories_data.append(cat_dict)
        
        return paginated_response(
            data=categories_data,
            total=result["total"],
            page=result["page"],
            limit=result["limit"],
            message="Kategoriler listelendi"
        )


@router.get("/{category_id}")
async def get_category(category_id: str):
    try:
        category = await category_manager.get_one(category_id)
        category_dict = category.model_dump()
        category_dict["id"] = str(category.id)
        
        return success_response(
            data=category_dict,
            message="Kategori bulundu"
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )


@router.patch("/{category_id}")
async def update_category(
    category_id: str,
    data: CategoryPatchSchema,
    current_user = Depends(get_current_user)
):
    if current_user.rol != 'admin':
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Bu işlem için admin yetkisi gerekli"
        )
    
    try:
        category = await category_manager.patch(category_id, data.model_dump(exclude_unset=True))
        category_dict = category.model_dump()
        category_dict["id"] = str(category.id)
        
        return success_response(
            data=category_dict,
            message="Kategori güncellendi"
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )


@router.delete("/{category_id}")
async def delete_category(category_id: str, current_user = Depends(get_current_user)):
    if current_user.rol != 'admin':
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Bu işlem için admin yetkisi gerekli"
        )
    
    try:
        await category_manager.soft_delete(category_id)
        return success_response(message="Kategori silindi")
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )
