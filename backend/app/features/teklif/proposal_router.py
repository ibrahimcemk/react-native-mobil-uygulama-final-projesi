from typing import Optional
from fastapi import APIRouter, HTTPException, Depends, status, Query
from app.core import success_response, paginated_response
from .proposal_schema import ProposalCreateSchema, ProposalResponseSchema, ProposalPatchSchema
from .proposal_manager import ProposalManager
from app.features.kullanici.user_router import get_current_user


router = APIRouter(prefix="/proposals", tags=["Teklifler"])
proposal_manager = ProposalManager()


@router.post("/project/{proje_id}", status_code=status.HTTP_201_CREATED)
async def create_proposal(
    proje_id: str,
    data: ProposalCreateSchema,
    current_user = Depends(get_current_user)
):
    if current_user.rol != 'freelancer':
        print(f"❌ Create Proposal - Non-freelancer tried: {current_user.rol}")
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Sadece freelancer'lar teklif verebilir"
        )
    
    try:
        print(f"📝 Create Proposal - Freelancer: {current_user.ad}, Project: {proje_id}, Amount: {data.teklif_tutari}")
        proposal = await proposal_manager.create_proposal(
            str(current_user.id),
            proje_id,
            data.model_dump()
        )
        proposal_dict = proposal.model_dump()
        proposal_dict["id"] = str(proposal.id)
        
        print(f"✅ Proposal created - ID: {proposal.id}")
        return success_response(
            data=proposal_dict,
            message="Teklif gönderildi"
        )
    except ValueError as e:
        print(f"❌ Create Proposal Error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@router.get("/project/{proje_id}")
async def get_project_proposals(proje_id: str, current_user = Depends(get_current_user)):
    from app.features.proje.project_repo import ProjectRepo
    
    try:
        print(f"📝 Get Project Proposals - Project: {proje_id}, User: {current_user.ad}")
        project_repo = ProjectRepo()
        project = await project_repo.get_one(proje_id)
        
        if project.client_id != str(current_user.id) and current_user.rol != 'admin':
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Sadece proje sahibi teklifleri görebilir"
            )
        
        proposals = await proposal_manager.get_project_proposals(proje_id)
        proposals_data = []
        for proposal in proposals:
            proposal_dict = proposal.model_dump()
            proposal_dict["id"] = str(proposal.id)
            proposals_data.append(proposal_dict)
        
        print(f"✅ {len(proposals_data)} teklif listelendi")
        return success_response(
            data=proposals_data,
            message="Teklifler listelendi"
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )


@router.get("/my-proposals")
async def get_my_proposals(current_user = Depends(get_current_user)):
    if current_user.rol != 'freelancer':
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Sadece freelancer'lar kendi tekliflerini görebilir"
        )
    
    try:
        proposals = await proposal_manager.get_freelancer_proposals(str(current_user.id))
        proposals_data = []
        for proposal in proposals:
            proposal_dict = proposal.model_dump()
            proposal_dict["id"] = str(proposal.id)
            proposals_data.append(proposal_dict)
        
        return success_response(
            data=proposals_data,
            message="Teklifleriniz listelendi"
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@router.get("/{proposal_id}")
async def get_proposal(proposal_id: str, current_user = Depends(get_current_user)):
    try:
        proposal = await proposal_manager.get_one(proposal_id)
        
        from app.features.proje.project_repo import ProjectRepo
        project_repo = ProjectRepo()
        project = await project_repo.get_one(proposal.proje_id)
        
        if (proposal.freelancer_id != str(current_user.id) and 
            project.client_id != str(current_user.id) and 
            current_user.rol != 'admin'):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Bu teklifi görme yetkiniz yok"
            )
        
        proposal_dict = proposal.model_dump()
        proposal_dict["id"] = str(proposal.id)
        
        return success_response(
            data=proposal_dict,
            message="Teklif bulundu"
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )


@router.post("/{proposal_id}/accept")
async def accept_proposal(proposal_id: str, current_user = Depends(get_current_user)):
    if current_user.rol != 'client':
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Sadece client'lar teklif kabul edebilir"
        )
    
    try:
        proposal = await proposal_manager.accept_proposal(proposal_id, str(current_user.id))
        proposal_dict = proposal.model_dump()
        proposal_dict["id"] = str(proposal.id)
        
        return success_response(
            data=proposal_dict,
            message="Teklif kabul edildi, proje başladı"
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@router.post("/{proposal_id}/reject")
async def reject_proposal(proposal_id: str, current_user = Depends(get_current_user)):
    if current_user.rol != 'client':
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Sadece client'lar teklif reddedebilir"
        )
    
    try:
        proposal = await proposal_manager.reject_proposal(proposal_id, str(current_user.id))
        proposal_dict = proposal.model_dump()
        proposal_dict["id"] = str(proposal.id)
        
        return success_response(
            data=proposal_dict,
            message="Teklif reddedildi"
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@router.post("/{proposal_id}/withdraw")
async def withdraw_proposal(proposal_id: str, current_user = Depends(get_current_user)):
    if current_user.rol != 'freelancer':
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Sadece freelancer'lar teklif geri çekebilir"
        )
    
    try:
        proposal = await proposal_manager.withdraw_proposal(proposal_id, str(current_user.id))
        proposal_dict = proposal.model_dump()
        proposal_dict["id"] = str(proposal.id)
        
        return success_response(
            data=proposal_dict,
            message="Teklif geri çekildi"
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@router.patch("/{proposal_id}")
async def update_proposal(
    proposal_id: str,
    data: ProposalPatchSchema,
    current_user = Depends(get_current_user)
):
    try:
        proposal = await proposal_manager.get_one(proposal_id)
        
        if proposal.freelancer_id != str(current_user.id):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Sadece kendi tekliflerinizi güncelleyebilirsiniz"
            )
        
        if proposal.durum != "pending":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Sadece bekleyen teklifler güncellenebilir"
            )
        
        updated_proposal = await proposal_manager.patch(proposal_id, data.model_dump(exclude_unset=True))
        proposal_dict = updated_proposal.model_dump()
        proposal_dict["id"] = str(updated_proposal.id)
        
        return success_response(
            data=proposal_dict,
            message="Teklif güncellendi"
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )


@router.delete("/{proposal_id}")
async def delete_proposal(proposal_id: str, current_user = Depends(get_current_user)):
    try:
        proposal = await proposal_manager.get_one(proposal_id)
        
        if proposal.freelancer_id != str(current_user.id) and current_user.rol != 'admin':
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Sadece kendi tekliflerinizi silebilirsiniz"
            )
        
        await proposal_manager.soft_delete(proposal_id)
        return success_response(message="Teklif silindi")
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )
