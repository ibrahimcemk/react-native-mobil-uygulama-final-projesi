from fastapi import APIRouter, UploadFile, File, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.core import (
    success_response,
    save_profile_image,
    delete_file,
    get_file_url,
    decode_access_token,
    validate_image_upload
)
from .user_manager import UserManager
from .user_schema import UserResponseSchema


router = APIRouter(prefix="/users", tags=["Kullanıcı Dosya İşlemleri"])
security = HTTPBearer()
user_manager = UserManager()


async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
   
    payload = decode_access_token(credentials.credentials)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Geçersiz veya süresi dolmuş token"
        )
    return payload


@router.post("/{user_id}/upload-image")
async def upload_profile_image(
    user_id: str,
    file: UploadFile = File(...),
    current_user: dict = Depends(get_current_user)
):
   
    user_id_from_token = current_user.get("sub")
    
    if user_id != user_id_from_token:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Bu işlem için yetkiniz yok"
        )
    
    is_valid, error_message = await validate_image_upload(file)
    if not is_valid:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=error_message
        )
    
    try:
        file_path = await save_profile_image(user_id, file)
        
        user = await user_manager.get_one(user_id)
        
        if user.profil_resmi:
            delete_file(user.profil_resmi)
        
        updated_user = await user_manager.update(user_id, {"profil_resmi": file_path})
        
        user_dict = updated_user.model_dump()
        user_dict["id"] = str(updated_user.id)
        user_dict.pop("sifre_hash", None)
        user_dict["profil_resmi_url"] = get_file_url(updated_user.profil_resmi) if updated_user.profil_resmi else None
        
        return success_response(
            data=user_dict,
            message="Profil resmi başarıyla yüklendi"
        )
    
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Dosya yüklenirken hata oluştu: {str(e)}"
        )


@router.delete("/{user_id}/delete-image", status_code=status.HTTP_200_OK)
async def delete_profile_image(
    user_id: str,
    current_user: dict = Depends(get_current_user)
):
    user_id_from_token = current_user.get("sub")
    
    if user_id != user_id_from_token:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Bu işlem için yetkiniz yok"
        )
    
    try:
        user = await user_manager.get_one(user_id)
        
        if not user.profil_resmi:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Profil resmi bulunamadı"
            )
        
        delete_file(user.profil_resmi)
        
        updated_user = await user_manager.update(user_id, {"profil_resmi": None})
        
        return success_response(message="Profil resmi başarıyla silindi")
    
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Dosya silinirken hata: {str(e)}"
        )
