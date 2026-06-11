
import re
from typing import Optional
from fastapi import UploadFile, HTTPException, status


MAX_FILE_SIZE = 5 * 1024 * 1024  
ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/jpg", "image/webp"]
ALLOWED_IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp"]


def validate_email(email: str) -> bool:
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return bool(re.match(pattern, email))


def validate_phone(phone: Optional[str]) -> bool:
    if not phone:
        return True
    
    pattern = r'^(\+90|0)?[1-9]\d{9}$'
    return bool(re.match(pattern, phone.replace(" ", "").replace("-", "")))


def validate_password_strength(password: str) -> tuple[bool, str]:
   
    if len(password) < 6:
        return False, "Şifre en az 6 karakter olmalıdır"
    
    if len(password) < 8:
        return True, "Weak: En az 8 karakter önerilir"
    
    has_upper = any(c.isupper() for c in password)
    has_lower = any(c.islower() for c in password)
    has_digit = any(c.isdigit() for c in password)
    
    if has_upper and has_lower and has_digit:
        return True, "Strong"
    elif (has_upper or has_lower) and has_digit:
        return True, "Medium"
    else:
        return True, "Weak: Büyük harf, küçük harf ve rakam kullanın"


async def validate_image_upload(file: UploadFile) -> tuple[bool, Optional[str]]:
    
    if not file:
        return False, "Dosya bulunamadı"
    
    if file.content_type not in ALLOWED_IMAGE_TYPES:
        return False, f"Geçersiz dosya tipi. İzin verilenler: {', '.join(ALLOWED_IMAGE_TYPES)}"
    
    if not any(file.filename.lower().endswith(ext) for ext in ALLOWED_IMAGE_EXTENSIONS):
        return False, f"Geçersiz dosya uzantısı. İzin verilenler: {', '.join(ALLOWED_IMAGE_EXTENSIONS)}"
    
    file.file.seek(0, 2)  
    file_size = file.file.tell()
    file.file.seek(0)  
    
    if file_size > MAX_FILE_SIZE:
        max_mb = MAX_FILE_SIZE / (1024 * 1024)
        return False, f"Dosya boyutu çok büyük. Maksimum: {max_mb}MB"
    
    if file_size == 0:
        return False, "Dosya boş"
    
    return True, None


def sanitize_filename(filename: str) -> str:
    filename = filename.replace("../", "").replace("..\\", "")
    
    filename = re.sub(r'[^\w\s.-]', '', filename)
    
    filename = filename.replace(" ", "_")
    
    if len(filename) > 255:
        name, ext = filename.rsplit(".", 1)
        filename = name[:250] + "." + ext
    
    return filename.lower()


def validate_object_id(id_str: str) -> bool:
    return bool(re.match(r'^[a-f\d]{24}$', id_str))
