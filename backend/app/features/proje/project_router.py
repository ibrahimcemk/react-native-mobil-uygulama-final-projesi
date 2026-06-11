from typing import Optional
from fastapi import APIRouter, HTTPException, Depends, status, Query
from pydantic import BaseModel
from app.core import success_response, paginated_response
from .project_schema import ProjectCreateSchema, ProjectResponseSchema, ProjectPatchSchema
from .project_manager import ProjectManager
from app.features.kullanici.user_router import get_current_user


router = APIRouter(prefix="/projects", tags=["Projeler"])
project_manager = ProjectManager()


class SelectFreelancerSchema(BaseModel):
    freelancer_id: str


class CompleteProjectSchema(BaseModel):
    pass


@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_project(data: ProjectCreateSchema, current_user = Depends(get_current_user)):
    if current_user.rol not in ['client', 'admin']:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Sadece client'lar proje oluşturabilir"
        )
    
    try:
        project = await project_manager.create_project(str(current_user.id), data.model_dump())
        project_dict = project.model_dump()
        project_dict["id"] = str(project.id)
        
        return success_response(
            data=project_dict,
            message="Proje oluşturuldu"
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@router.get("/")
async def get_projects(
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    durum: Optional[str] = Query(None),
    kategori_id: Optional[str] = Query(None),
    client_id: Optional[str] = Query(None),
    search: Optional[str] = Query(None)
):
    filters = {}
    
    if durum:
        filters["durum"] = durum
    if kategori_id:
        filters["kategori_id"] = kategori_id
    if client_id:
        filters["client_id"] = client_id
    if search:
        filters["$or"] = [
            {"baslik": {"$regex": search, "$options": "i"}},
            {"aciklama": {"$regex": search, "$options": "i"}}
        ]
    
    result = await project_manager.get_many(
        filters=filters,
        page=page,
        limit=limit,
        sort_by="olusturulma_tarihi",
        sort_order=-1
    )
    
    projects_data = []
    for project in result["data"]:
        project_dict = project.model_dump()
        project_dict["id"] = str(project.id)
        projects_data.append(project_dict)
    
    return paginated_response(
        data=projects_data,
        total=result["total"],
        page=result["page"],
        limit=result["limit"],
        message="Projeler listelendi"
    )


@router.get("/open")
async def get_open_projects(kategori_id: Optional[str] = Query(None)):
    try:
        projects = await project_manager.get_open_projects(kategori_id)
        projects_data = []
        for project in projects:
            project_dict = project.model_dump()
            project_dict["id"] = str(project.id)
            projects_data.append(project_dict)
        
        return success_response(
            data=projects_data,
            message="Açık projeler listelendi"
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@router.get("/my-projects")
async def get_my_projects(current_user = Depends(get_current_user)):
    try:
        if current_user.rol == "client":
            projects = await project_manager.get_client_projects(str(current_user.id))
        elif current_user.rol == "freelancer":
            projects = await project_manager.get_freelancer_projects(str(current_user.id))
        else:
            projects = []
        
        projects_data = []
        for project in projects:
            project_dict = project.model_dump()
            project_dict["id"] = str(project.id)
            projects_data.append(project_dict)
        
        return success_response(
            data=projects_data,
            message="Projeler getirildi"
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@router.get("/{project_id}")
async def get_project(project_id: str):
    try:
        project = await project_manager.get_one(project_id)
        project_dict = project.model_dump()
        project_dict["id"] = str(project.id)
        
        return success_response(
            data=project_dict,
            message="Proje bulundu"
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )


@router.patch("/{project_id}")
async def update_project(
    project_id: str,
    data: ProjectPatchSchema,
    current_user = Depends(get_current_user)
):
    try:
        project = await project_manager.get_one(project_id)
        
        if project.client_id != str(current_user.id) and current_user.rol != 'admin':
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Bu projeyi sadece sahibi güncelleyebilir"
            )
        
        updated_project = await project_manager.patch(project_id, data.model_dump(exclude_unset=True))
        project_dict = updated_project.model_dump()
        project_dict["id"] = str(updated_project.id)
        
        return success_response(
            data=project_dict,
            message="Proje güncellendi"
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )


@router.post("/{project_id}/select-freelancer")
async def select_freelancer(
    project_id: str,
    data: SelectFreelancerSchema,
    current_user = Depends(get_current_user)
):
    try:
        project = await project_manager.select_freelancer(
            project_id,
            data.freelancer_id,
            str(current_user.id)
        )
        project_dict = project.model_dump()
        project_dict["id"] = str(project.id)
        
        return success_response(
            data=project_dict,
            message="Freelancer seçildi, proje başladı"
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@router.post("/{project_id}/complete")
async def complete_project(
    project_id: str,
    current_user = Depends(get_current_user)
):
    try:
        project = await project_manager.complete_project(
            project_id,
            str(current_user.id),
            current_user.rol
        )
        project_dict = project.model_dump()
        project_dict["id"] = str(project.id)
        
        return success_response(
            data=project_dict,
            message="Proje tamamlandı"
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@router.post("/{project_id}/cancel")
async def cancel_project(project_id: str, current_user = Depends(get_current_user)):
    try:
        project = await project_manager.cancel_project(project_id, str(current_user.id))
        project_dict = project.model_dump()
        project_dict["id"] = str(project.id)
        
        return success_response(
            data=project_dict,
            message="Proje iptal edildi"
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@router.delete("/{project_id}")
async def delete_project(project_id: str, current_user = Depends(get_current_user)):
    try:
        project = await project_manager.get_one(project_id)
        
        if project.client_id != str(current_user.id) and current_user.rol != 'admin':
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Bu projeyi sadece sahibi silebilir"
            )
        
        await project_manager.soft_delete(project_id)
        return success_response(message="Proje silindi")
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )
