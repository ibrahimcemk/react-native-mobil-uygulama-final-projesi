from fastapi import HTTPException, status
from bson import ObjectId


def validate_object_id(id_str: str) -> str:
   
    if not ObjectId.is_valid(id_str):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Geçersiz ID formatı"
        )
    return id_str
