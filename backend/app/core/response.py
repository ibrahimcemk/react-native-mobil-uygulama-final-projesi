from typing import Optional, Any, Dict, List
from pydantic import BaseModel, Field
from datetime import datetime


class ApiResponse(BaseModel):
    success: bool
    message: Optional[str] = None
    data: Optional[Any] = None
    errors: Optional[List[Dict[str, Any]]] = None
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }


class PaginatedApiResponse(ApiResponse):
    data: Optional[List[Any]] = None
    pagination: Optional[Dict[str, Any]] = None


def success_response(data: Any = None, message: str = "İşlem başarılı") -> Dict:
    return ApiResponse(
        success=True,
        message=message,
        data=data
    ).model_dump()


def error_response(message: str = "Bir hata oluştu", errors: List[Dict] = None) -> Dict:
    return ApiResponse(
        success=False,
        message=message,
        errors=errors or []
    ).model_dump()


def paginated_response(
    data: List[Any],
    total: int,
    page: int,
    limit: int,
    message: str = "Veriler başarıyla getirildi"
) -> Dict:
    return PaginatedApiResponse(
        success=True,
        message=message,
        data=data,
        pagination={
            "total": total,
            "page": page,
            "limit": limit,
            "total_pages": (total + limit - 1) // limit,
            "has_next": page * limit < total,
            "has_prev": page > 1
        }
    ).model_dump()


def validation_error_response(errors: List[Dict]) -> Dict:
    return ApiResponse(
        success=False,
        message="Doğrulama hatası",
        errors=errors
    ).model_dump()
