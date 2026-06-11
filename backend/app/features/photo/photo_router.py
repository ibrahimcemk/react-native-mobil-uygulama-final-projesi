from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from typing import Optional, List
from app.core.security import get_current_user
from app.core.file_handler import save_file, delete_file
from app.core.response import success_response, error_response
from .photo_manager import PhotoManager
from .photo_schema import PhotoSchema, PhotoUpdateSchema

photo_router = APIRouter(prefix="/photos", tags=["photos"])


def photo_to_dict(photo) -> dict:
    return {
        "id": str(photo.id),
        "kullanici_id": photo.kullanici_id,
        "kullanici_adi": photo.kullanici_adi,
        "kullanici_profil_resmi": photo.kullanici_profil_resmi,
        "resim_url": photo.resim_url,
        "baslik": photo.baslik,
        "konum": photo.konum,
        "goruntulenme": photo.goruntulenme,
        "begeni_sayisi": photo.begeni_sayisi,
        "begenenler": photo.begenenler,
        "yorum_sayisi": photo.yorum_sayisi,
        "herkese_acik": photo.herkese_acik,
        "olusturulma_tarihi": photo.olusturulma_tarihi.isoformat() if photo.olusturulma_tarihi else None,
        "degistirilme_tarihi": photo.degistirilme_tarihi.isoformat() if photo.degistirilme_tarihi else None,
        "aktif_mi": photo.aktif_mi,
        "silindi_mi": photo.silindi_mi
    }


@photo_router.post("/upload", status_code=status.HTTP_201_CREATED)
async def upload_photo(
    file: UploadFile = File(...),
    baslik: Optional[str] = Form(None),
    konum: Optional[str] = Form(None),
    herkese_acik: bool = Form(True),
    current_user = Depends(get_current_user)
):
    
    try:
        print(f"📸 Photo Upload Started - User: {current_user.ad}, File: {file.filename}")
        manager = PhotoManager()
        
        print(f"💾 Saving file: {file.filename}")
        file_path = await save_file(file, "photos")
        print(f"✅ File saved to: {file_path}")
        
        photo_data = {
            "baslik": baslik,
            "konum": konum,
            "herkese_acik": herkese_acik,
        }
        print(f"📝 Photo data: {photo_data}")
        print(f"👤 User info - ID: {current_user.id}, Name: {current_user.ad}, Profile: {current_user.profil_resmi}")
        
        photo = await manager.create_photo(
            user_id=str(current_user.id),
            user_name=current_user.ad,
            user_profile_img=current_user.profil_resmi if current_user.profil_resmi else None,
            image_url=file_path,
            data=photo_data
        )
        print(f"✅ Photo created successfully - ID: {photo.id}")
        
        return success_response(
            data=photo_to_dict(photo),
            message="Fotoğraf başarıyla yüklendi"
        )
        
    except Exception as e:
        import traceback
        print(f"❌ Photo Upload Error: {str(e)}")
        print(f"🔍 Traceback:\n{traceback.format_exc()}")
        return error_response(str(e), status.HTTP_400_BAD_REQUEST)


@photo_router.get("/feed")
async def get_public_feed(
    skip: int = 0,
    limit: int = 20,
    current_user = Depends(get_current_user)
):
    
    try:
        manager = PhotoManager()
        photos = await manager.get_public_feed(skip, limit)
        total = await manager.get_public_feed_count()
        
        return success_response(
            data={
                "photos": [photo_to_dict(p) for p in photos],
                "total": total,
                "skip": skip,
                "limit": limit
            },
            message="Public feed getirildi"
        )
        
    except Exception as e:
        return error_response(str(e), status.HTTP_400_BAD_REQUEST)


@photo_router.get("/my-photos")
async def get_my_photos(
    skip: int = 0,
    limit: int = 20,
    current_user = Depends(get_current_user)
):
    
    try:
        manager = PhotoManager()
        photos = await manager.get_user_photos(str(current_user.id), skip, limit)
        total = await manager.get_user_photo_count(str(current_user.id))
        
        return success_response(
            data={
                "photos": [photo_to_dict(p) for p in photos],
                "total": total,
                "skip": skip,
                "limit": limit
            },
            message="Fotoğraflar getirildi"
        )
        
    except Exception as e:
        return error_response(str(e), status.HTTP_400_BAD_REQUEST)


@photo_router.get("/user/{user_id}")
async def get_user_photos(
    user_id: str,
    skip: int = 0,
    limit: int = 20,
    current_user = Depends(get_current_user)
):
    
    try:
        manager = PhotoManager()
        if str(current_user.id) == user_id:
            photos = await manager.get_user_photos(user_id, skip, limit)
            total = await manager.get_user_photo_count(user_id)
        else:
            photos = await manager.get_user_public_photos(user_id, skip, limit)
            total = len(photos)
        
        return success_response(
            data={
                "photos": [photo_to_dict(p) for p in photos],
                "total": total,
                "skip": skip,
                "limit": limit
            },
            message="Fotoğraflar getirildi"
        )
        
    except Exception as e:
        return error_response(str(e), status.HTTP_400_BAD_REQUEST)


@photo_router.get("/{photo_id}")
async def get_photo(
    photo_id: str,
    current_user = Depends(get_current_user)
):
    
    try:
        manager = PhotoManager()
        
        await manager.increment_view(photo_id)
        
        photo = await manager.get_one(photo_id)
        if not photo:
            raise HTTPException(status_code=404, detail="Fotoğraf bulunamadı")
        
        return success_response(
            data=photo_to_dict(photo),
            message="Fotoğraf getirildi"
        )
        
    except HTTPException:
        raise
    except Exception as e:
        return error_response(str(e), status.HTTP_400_BAD_REQUEST)


@photo_router.patch("/{photo_id}")
async def update_photo(
    photo_id: str,
    data: PhotoUpdateSchema,
    current_user = Depends(get_current_user)
):
    
    try:
        manager = PhotoManager()
        photo = await manager.get_one(photo_id)
        
        if not photo:
            raise HTTPException(status_code=404, detail="Fotoğraf bulunamadı")
        
        if photo.kullanici_id != str(current_user.id):
            raise HTTPException(status_code=403, detail="Bu fotoğrafı düzenleme yetkiniz yok")
        
        update_data = data.dict(exclude_unset=True)
        updated = await manager.update(photo_id, update_data)
        
        return success_response(
            data=photo_to_dict(updated),
            message="Fotoğraf güncellendi"
        )
        
    except HTTPException:
        raise
    except Exception as e:
        return error_response(str(e), status.HTTP_400_BAD_REQUEST)


@photo_router.delete("/{photo_id}")
async def delete_photo(
    photo_id: str,
    current_user = Depends(get_current_user)
):
    
    try:
        manager = PhotoManager()
        await manager.delete_photo(photo_id, str(current_user.id))
        
        return success_response(
            data=None,
            message="Fotoğraf silindi"
        )
        
    except PermissionError as e:
        raise HTTPException(status_code=403, detail=str(e))
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        return error_response(str(e), status.HTTP_400_BAD_REQUEST)
