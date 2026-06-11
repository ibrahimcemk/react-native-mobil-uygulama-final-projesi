from typing import Optional
from fastapi import APIRouter, HTTPException, Depends, status, Query
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from app.core import decode_access_token, success_response, paginated_response, get_file_url
from .user_schema import UserCreateSchema, UserResponseSchema, UserPatchSchema, UserLoginSchema, TokenResponse
from .user_manager import UserManager


router = APIRouter(prefix="/users", tags=["Kullanıcılar"])
security = HTTPBearer()
user_manager = UserManager()


class ChangePasswordSchema(BaseModel):
    old_password: str
    new_password: str


def add_profile_image_url(user_data: dict) -> dict:
    """Kullanıcı verisine profil_resmi_url ekler, hassas alanları kaldırır"""
    user_copy = user_data.copy()
    user_copy.pop('sifre_hash', None)
    if 'profil_resmi' in user_copy and user_copy['profil_resmi']:
        user_copy['profil_resmi_url'] = get_file_url(user_copy['profil_resmi'])
    else:
        user_copy['profil_resmi_url'] = None
    return user_copy


async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    payload = decode_access_token(token)
    
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Geçersiz veya süresi dolmuş token"
        )
    
    user_id = payload.get("sub")
    try:
        user = await user_manager.get_one(user_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Kullanıcı bulunamadı veya hesap silindi"
        )
    return user


@router.post("/register", status_code=status.HTTP_201_CREATED)
async def register(data: UserCreateSchema):
    try:
        user = await user_manager.register(data.model_dump())
        user_dict = user.model_dump()
        user_dict["id"] = str(user.id)
        user_data = add_profile_image_url(user_dict)
        return success_response(
            data=user_data,
            message="Kayıt başarılı! Şimdi giriş yapabilirsiniz."
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@router.post("/login")
async def login(data: UserLoginSchema):
    try:
        result = await user_manager.login(data.email, data.sifre)
        user = result["user"]
        user_dict = user.model_dump()
        user_dict["id"] = str(user.id)
        user_data = add_profile_image_url(user_dict)
        return success_response(
            data={
                "access_token": result["access_token"],
                "token_type": result["token_type"],
                "user": user_data
            },
            message="Giriş başarılı!"
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(e)
        )


@router.get("/me")
async def get_me(current_user = Depends(get_current_user)):
    user_dict = current_user.model_dump()
    user_dict["id"] = str(current_user.id)
    user_data = add_profile_image_url(user_dict)
    return success_response(
        data=user_data,
        message="Profil bilgileri getirildi"
    )


@router.get("/{user_id}")
async def get_user(user_id: str, current_user = Depends(get_current_user)):
    try:
        user = await user_manager.get_one(user_id)
        user_dict = user.model_dump()
        user_dict["id"] = str(user.id)
        user_data = add_profile_image_url(user_dict)
        return success_response(
            data=user_data,
            message="Kullanıcı bulundu"
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )


@router.get("/")
async def get_users(
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    sort_by: str = Query("olusturulma_tarihi"),
    search: Optional[str] = Query(None),
    aktif_mi: Optional[bool] = Query(None),
    rol: Optional[str] = Query(None),
    current_user = Depends(get_current_user)
):
    filters = {}
    if search:
        filters["$or"] = [
            {"ad": {"$regex": search, "$options": "i"}},
            {"email": {"$regex": search, "$options": "i"}}
        ]
    if aktif_mi is not None:
        filters["aktif_mi"] = aktif_mi
    if rol:
        filters["rol"] = rol
    
    result = await user_manager.get_many(
        filters=filters,
        page=page,
        limit=limit,
        sort_by=sort_by
    )
    
    users_data = []
    for u in result["data"]:
        user_dict = u.model_dump()
        user_dict["id"] = str(u.id)
        users_data.append(add_profile_image_url(user_dict))
    
    return paginated_response(
        data=users_data,
        total=result["total"],
        page=result["page"],
        limit=result["limit"],
        message="Kullanıcılar listelendi"
    )


@router.patch("/{user_id}")
async def update_user(
    user_id: str,
    data: UserPatchSchema,
    current_user = Depends(get_current_user)
):
    if str(current_user.id) != user_id and current_user.rol != 'admin':
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Bu işlem için yetkiniz yok"
        )
    try:
        update_data = data.model_dump(exclude_unset=True)
        if current_user.rol != 'admin':
            update_data.pop('rol', None)
            update_data.pop('aktif_mi', None)
        user = await user_manager.patch(user_id, update_data)
        user_dict = user.model_dump()
        user_dict["id"] = str(user.id)
        user_data = add_profile_image_url(user_dict)
        return success_response(
            data=user_data,
            message="Kullanıcı güncellendi"
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )


@router.delete("/{user_id}")
async def soft_delete_user(user_id: str, current_user = Depends(get_current_user)):
    if str(current_user.id) != user_id and current_user.rol != 'admin':
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Bu işlem için yetkiniz yok"
        )
    try:
        await user_manager.soft_delete(user_id)
        return success_response(message="Kullanıcı silindi")
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )


@router.post("/change-password")
async def change_password(
    data: ChangePasswordSchema,
    current_user = Depends(get_current_user)
):
    try:
        user_id = str(current_user.id)
        success = await user_manager.change_password(
            user_id, 
            data.old_password, 
            data.new_password
        )
        return success_response(message="Şifre başarıyla değiştirildi")
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
