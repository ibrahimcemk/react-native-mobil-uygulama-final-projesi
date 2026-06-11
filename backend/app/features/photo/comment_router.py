from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from app.core.security import get_current_user
from app.core.response import success_response, error_response
from .comment_repo import CommentRepo
from .photo_repo import PhotoRepo
from pydantic import BaseModel

comment_router = APIRouter(prefix="/photos", tags=["photo-comments"])


class CommentCreate(BaseModel):
    yorum: str


class CommentResponse(BaseModel):
    id: str
    photo_id: str
    kullanici_id: str
    kullanici_adi: str
    kullanici_profil_resmi: str = None
    yorum: str
    olusturulma_tarihi: str


@comment_router.post("/{photo_id}/comments", status_code=status.HTTP_201_CREATED)
async def add_comment(
    photo_id: str,
    data: CommentCreate,
    current_user = Depends(get_current_user)
):
    
    try:
        comment_repo = CommentRepo()
        photo_repo = PhotoRepo()
        
        photo = await photo_repo.get_one(photo_id)
        if not photo:
            raise HTTPException(status_code=404, detail="Fotoğraf bulunamadı")
        
        comment_data = {
            "photo_id": photo_id,
            "kullanici_id": str(current_user.id),
            "kullanici_adi": current_user.ad,
            "kullanici_profil_resmi": current_user.profil_resmi,
            "yorum": data.yorum,
        }
        comment = await comment_repo.create(comment_data)
        
        await photo_repo.increment_comment_count(photo_id)
        
        return success_response(
            data={
                "id": str(comment.id),
                "photo_id": comment.photo_id,
                "kullanici_id": comment.kullanici_id,
                "kullanici_adi": comment.kullanici_adi,
                "kullanici_profil_resmi": comment.kullanici_profil_resmi,
                "yorum": comment.yorum,
                "olusturulma_tarihi": comment.olusturulma_tarihi.isoformat(),
            },
            message="Yorum eklendi"
        )
        
    except HTTPException:
        raise
    except Exception as e:
        return error_response(str(e), status.HTTP_400_BAD_REQUEST)


@comment_router.get("/{photo_id}/comments")
async def get_comments(
    photo_id: str,
    skip: int = 0,
    limit: int = 50,
    current_user = Depends(get_current_user)
):
    
    try:
        comment_repo = CommentRepo()
        
        comments = await comment_repo.get_photo_comments(photo_id, skip, limit)
        total = await comment_repo.get_comment_count(photo_id)
        
        return success_response(
            data={
                "comments": [
                    {
                        "id": str(c.id),
                        "photo_id": c.photo_id,
                        "kullanici_id": c.kullanici_id,
                        "kullanici_adi": c.kullanici_adi,
                        "kullanici_profil_resmi": c.kullanici_profil_resmi,
                        "yorum": c.yorum,
                        "olusturulma_tarihi": c.olusturulma_tarihi.isoformat(),
                    }
                    for c in comments
                ],
                "total": total,
            },
            message="Yorumlar getirildi"
        )
        
    except Exception as e:
        return error_response(str(e), status.HTTP_400_BAD_REQUEST)


@comment_router.delete("/{photo_id}/comments/{comment_id}")
async def delete_comment(
    photo_id: str,
    comment_id: str,
    current_user = Depends(get_current_user)
):
    
    try:
        comment_repo = CommentRepo()
        photo_repo = PhotoRepo()
        
        comment = await comment_repo.get_one(comment_id)
        if not comment:
            raise HTTPException(status_code=404, detail="Yorum bulunamadı")
        
        photo = await photo_repo.get_one(photo_id)
        
        if comment.kullanici_id != str(current_user.id) and photo.kullanici_id != str(current_user.id):
            raise HTTPException(status_code=403, detail="Bu yorumu silme yetkiniz yok")
        
        await comment_repo.delete_comment(comment_id)
        await photo_repo.decrement_comment_count(photo_id)
        
        return success_response(
            data=None,
            message="Yorum silindi"
        )
        
    except HTTPException:
        raise
    except Exception as e:
        return error_response(str(e), status.HTTP_400_BAD_REQUEST)


@comment_router.post("/{photo_id}/like")
async def toggle_like(
    photo_id: str,
    current_user = Depends(get_current_user)
):
    
    try:
        photo_repo = PhotoRepo()
        
        result = await photo_repo.toggle_like(photo_id, str(current_user.id))
        
        if not result["success"]:
            raise HTTPException(status_code=404, detail=result["message"])
        
        return success_response(
            data={
                "liked": result["liked"],
                "begeni_sayisi": result["count"],
            },
            message="Beğeni güncellendi"
        )
        
    except HTTPException:
        raise
    except Exception as e:
        return error_response(str(e), status.HTTP_400_BAD_REQUEST)
