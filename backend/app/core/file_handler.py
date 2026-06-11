import os
import uuid
import logging
from pathlib import Path
from typing import Optional
from fastapi import UploadFile, HTTPException
from PIL import Image
import io

logger = logging.getLogger(__name__)


UPLOAD_DIR = Path("uploads")
ALLOWED_IMAGE_TYPES = {"image/jpeg", "image/png", "image/jpg", "image/webp"}
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB


def ensure_upload_dir():
    profile_dir = UPLOAD_DIR / "profiles"
    profile_dir.mkdir(parents=True, exist_ok=True)
    photos_dir = UPLOAD_DIR / "photos"
    photos_dir.mkdir(parents=True, exist_ok=True)
    return profile_dir


def validate_image(file: UploadFile) -> None:
    if file.content_type not in ALLOWED_IMAGE_TYPES:
        raise HTTPException(
            status_code=400,
            detail=f"Geçersiz dosya tipi. İzin verilen: {', '.join(ALLOWED_IMAGE_TYPES)}"
        )


async def save_profile_image(user_id: str, file: UploadFile) -> str:
  
    validate_image(file)
    
    contents = await file.read()
    
    if len(contents) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=400,
            detail=f"Dosya çok büyük. Maksimum: {MAX_FILE_SIZE / (1024*1024)}MB"
        )
    
    profile_dir = ensure_upload_dir()
    
    filename = f"{user_id}_{uuid.uuid4().hex[:8]}.jpg"
    file_path = profile_dir / filename
    
    try:
        image = Image.open(io.BytesIO(contents))
        
        if image.mode in ('RGBA', 'LA', 'P'):
            if image.mode == 'P':
                image = image.convert('RGBA')
            background = Image.new('RGB', image.size, (255, 255, 255))
            background.paste(image, mask=image.split()[-1] if image.mode in ('RGBA', 'LA') else None)
            image = background
        
        max_size = (800, 800)
        image.thumbnail(max_size, Image.Resampling.LANCZOS)
        
        image.save(file_path, 'JPEG', quality=85, optimize=True)
        
        return f"uploads/profiles/{filename}"
    
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Resim işlenemedi: {str(e)}")


def delete_file(file_path: str) -> bool:
    try:
        full_path = Path(file_path)
        if full_path.exists():
            full_path.unlink()
            logger.info(f"File deleted successfully: {file_path}")
            return True
        logger.warning(f"File not found for deletion: {file_path}")
        return False
    except Exception as e:
        logger.error(f"File delete error: {file_path} - {str(e)}")
        return False


async def save_file(file: UploadFile, folder: str = "photos") -> str:
    validate_image(file)
    
    contents = await file.read()
    
    if len(contents) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=400,
            detail=f"Dosya çok büyük. Maksimum: {MAX_FILE_SIZE / (1024*1024)}MB"
        )
    
    upload_dir = UPLOAD_DIR / folder
    upload_dir.mkdir(parents=True, exist_ok=True)
    
    filename = f"{uuid.uuid4().hex}.jpg"
    file_path = upload_dir / filename
    
    try:
        image = Image.open(io.BytesIO(contents))
        
        if image.mode in ('RGBA', 'LA', 'P'):
            if image.mode == 'P':
                image = image.convert('RGBA')
            background = Image.new('RGB', image.size, (255, 255, 255))
            background.paste(image, mask=image.split()[-1] if image.mode in ('RGBA', 'LA') else None)
            image = background
        
        max_size = (1200, 1200)
        image.thumbnail(max_size, Image.Resampling.LANCZOS)
        
        image.save(file_path, 'JPEG', quality=90, optimize=True)
        
        return f"uploads/{folder}/{filename}"
    
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Resim işlenemedi: {str(e)}")


def get_file_url(file_path: Optional[str], base_url: Optional[str] = None) -> Optional[str]:
   
    if not file_path:
        return None
    
    if base_url is None:
        from .config import settings
        base_url = getattr(settings, 'BASE_URL', 'http://localhost:8000')
    
    return f"{base_url}/{file_path}"
