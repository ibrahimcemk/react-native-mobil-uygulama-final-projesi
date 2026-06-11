from typing import Optional
from fastapi import APIRouter, HTTPException, Depends, status, Query
from app.core import success_response, paginated_response
from .review_schema import ReviewCreateSchema, ReviewResponseSchema, ReviewPatchSchema
from .review_manager import ReviewManager
from app.features.kullanici.user_router import get_current_user


router = APIRouter(prefix="/reviews", tags=["İncelemeler"])
review_manager = ReviewManager()


@router.post("/project/{proje_id}", status_code=status.HTTP_201_CREATED)
async def create_review(
    proje_id: str,
    data: ReviewCreateSchema,
    current_user = Depends(get_current_user)
):
    """Proje için inceleme yaz"""
    try:
        review = await review_manager.create_review(
            str(current_user.id),
            proje_id,
            data.model_dump()
        )
        review_dict = review.model_dump()
        review_dict["id"] = str(review.id)
        
        return success_response(
            data=review_dict,
            message="İnceleme oluşturuldu"
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@router.get("/user/{user_id}")
async def get_user_reviews(user_id: str):
    """Kullanıcı hakkındaki incelemeleri getir"""
    try:
        reviews = await review_manager.get_user_reviews(user_id)
        reviews_data = []
        for review in reviews:
            review_dict = review.model_dump()
            review_dict["id"] = str(review.id)
            reviews_data.append(review_dict)
        
        return success_response(
            data=reviews_data,
            message="İncelemeler listelendi"
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@router.get("/project/{proje_id}")
async def get_project_reviews(proje_id: str):
    """Projeye ait incelemeleri getir"""
    try:
        reviews = await review_manager.get_project_reviews(proje_id)
        reviews_data = []
        for review in reviews:
            review_dict = review.model_dump()
            review_dict["id"] = str(review.id)
            reviews_data.append(review_dict)
        
        return success_response(
            data=reviews_data,
            message="İncelemeler listelendi"
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@router.get("/user/{user_id}/stats")
async def get_user_stats(user_id: str):
    """Kullanıcının istatistiklerini getir"""
    try:
        stats = await review_manager.calculate_user_stats(user_id)
        
        return success_response(
            data=stats,
            message="İstatistikler hesaplandı"
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@router.get("/{review_id}")
async def get_review(review_id: str):
    try:
        review = await review_manager.get_one(review_id)
        review_dict = review.model_dump()
        review_dict["id"] = str(review.id)
        
        return success_response(
            data=review_dict,
            message="İnceleme bulundu"
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )


@router.patch("/{review_id}")
async def update_review(
    review_id: str,
    data: ReviewPatchSchema,
    current_user = Depends(get_current_user)
):
    try:
        review = await review_manager.get_one(review_id)
        
        if review.degerlendiren_id != str(current_user.id):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Sadece kendi incelemelerinizi güncelleyebilirsiniz"
            )
        
        updated_review = await review_manager.patch(review_id, data.model_dump(exclude_unset=True))
        
        stats = await review_manager.calculate_user_stats(review.degerlendirilen_id)
        from app.features.kullanici.user_repo import UserRepo
        user_repo = UserRepo()
        await user_repo.update(review.degerlendirilen_id, {
            "ortalama_puan": stats["ortalama_puan"],
            "toplam_inceleme": stats["toplam_inceleme"]
        })
        
        review_dict = updated_review.model_dump()
        review_dict["id"] = str(updated_review.id)
        
        return success_response(
            data=review_dict,
            message="İnceleme güncellendi"
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )


@router.delete("/{review_id}")
async def delete_review(review_id: str, current_user = Depends(get_current_user)):
    try:
        review = await review_manager.get_one(review_id)
        
        if review.degerlendiren_id != str(current_user.id) and current_user.rol != 'admin':
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Sadece kendi incelemelerinizi silebilirsiniz"
            )
        
        await review_manager.soft_delete(review_id)
        
        stats = await review_manager.calculate_user_stats(review.degerlendirilen_id)
        from app.features.kullanici.user_repo import UserRepo
        user_repo = UserRepo()
        await user_repo.update(review.degerlendirilen_id, {
            "ortalama_puan": stats["ortalama_puan"],
            "toplam_inceleme": stats["toplam_inceleme"]
        })
        
        return success_response(message="İnceleme silindi")
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )
