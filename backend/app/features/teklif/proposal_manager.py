from typing import Dict, Any, List
from app.base import BaseManager
from .proposal_repo import ProposalRepo
from .proposal_model import Proposal


class ProposalManager(BaseManager[Proposal]):
    def __init__(self):
        self.repo = ProposalRepo()
        super().__init__(self.repo)
    
    async def create_proposal(self, freelancer_id: str, proje_id: str, data: Dict[str, Any]) -> Proposal:
        existing = await self.repo.check_existing_proposal(proje_id, freelancer_id)
        if existing:
            raise ValueError("Bu projeye zaten teklif verdiniz")
        
        data["ad"] = f"Teklif-{proje_id[:8]}-{freelancer_id[:8]}"
        data["freelancer_id"] = freelancer_id
        data["proje_id"] = proje_id
        data["durum"] = "pending"
        
        if data.get("teklif_tutari", 0) <= 0:
            raise ValueError("Teklif tutarı pozitif olmalıdır")
        
        if data.get("teslim_suresi_gun", 0) <= 0:
            raise ValueError("Teslim süresi pozitif olmalıdır")
        
        proposal = await self.repo.create(data)
        
        from app.features.proje.project_repo import ProjectRepo
        project_repo = ProjectRepo()
        project = await project_repo.get_one(proje_id)
        if project:
            count = await self.repo.count_by_project(proje_id)
            await project_repo.update(proje_id, {"teklif_sayisi": count})
        
        return proposal
    
    async def get_project_proposals(self, proje_id: str) -> List[Proposal]:
        return await self.repo.get_by_project(proje_id)
    
    async def get_freelancer_proposals(self, freelancer_id: str) -> List[Proposal]:
        return await self.repo.get_by_freelancer(freelancer_id)
    
    async def accept_proposal(self, proposal_id: str, client_id: str) -> Proposal:
        from app.features.proje.project_repo import ProjectRepo
        
        proposal = await self.get_one(proposal_id)
        
        project_repo = ProjectRepo()
        project = await project_repo.get_one(proposal.proje_id)
        
        if project.client_id != client_id:
            raise ValueError("Bu projenin tekliflerini sadece proje sahibi kabul edebilir")
        
        if project.durum != "open":
            raise ValueError("Sadece açık projelerin teklifleri kabul edilebilir")
        
        if proposal.durum != "pending":
            raise ValueError("Sadece bekleyen teklifler kabul edilebilir")
        
        updated_proposal = await self.repo.update(proposal_id, {"durum": "accepted"})
        
        other_proposals = await self.repo.get_by_project(proposal.proje_id)
        for other in other_proposals:
            if str(other.id) != proposal_id and other.durum == "pending":
                await self.repo.update(str(other.id), {"durum": "rejected"})
        
        await project_repo.update(
            proposal.proje_id,
            {
                "secilen_freelancer_id": proposal.freelancer_id,
                "durum": "in_progress"
            }
        )
        
        return updated_proposal
    
    async def reject_proposal(self, proposal_id: str, client_id: str) -> Proposal:
        from app.features.proje.project_repo import ProjectRepo
        
        proposal = await self.get_one(proposal_id)
        
        project_repo = ProjectRepo()
        project = await project_repo.get_one(proposal.proje_id)
        
        if project.client_id != client_id:
            raise ValueError("Bu projenin tekliflerini sadece proje sahibi reddedebilir")
        
        if proposal.durum != "pending":
            raise ValueError("Sadece bekleyen teklifler reddedilebilir")
        
        return await self.repo.update(proposal_id, {"durum": "rejected"})
    
    async def withdraw_proposal(self, proposal_id: str, freelancer_id: str) -> Proposal:
        proposal = await self.get_one(proposal_id)
        
        if proposal.freelancer_id != freelancer_id:
            raise ValueError("Sadece kendi tekliflerinizi geri çekebilirsiniz")
        
        if proposal.durum != "pending":
            raise ValueError("Sadece bekleyen teklifler geri çekilebilir")
        
        updated = await self.repo.update(proposal_id, {"durum": "withdrawn"})
        
        from app.features.proje.project_repo import ProjectRepo
        project_repo = ProjectRepo()
        count = await self.repo.count_by_project(proposal.proje_id)
        await project_repo.update(proposal.proje_id, {"teklif_sayisi": count})
        
        return updated
