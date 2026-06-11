from typing import List, Optional
from app.base import BaseRepo
from .proposal_model import Proposal


class ProposalRepo(BaseRepo[Proposal]):
    def __init__(self):
        super().__init__(Proposal)
    
    async def get_by_project(self, proje_id: str) -> List[Proposal]:
        proposals = await self.model.find(
            self.model.proje_id == proje_id,
            self.model.silindi_mi == False
        ).sort([("olusturulma_tarihi", -1)]).to_list()
        return proposals
    
    async def get_by_freelancer(self, freelancer_id: str) -> List[Proposal]:
        proposals = await self.model.find(
            self.model.freelancer_id == freelancer_id,
            self.model.silindi_mi == False
        ).sort([("olusturulma_tarihi", -1)]).to_list()
        return proposals
    
    async def check_existing_proposal(self, proje_id: str, freelancer_id: str) -> Optional[Proposal]:
        proposal = await self.model.find_one(
            self.model.proje_id == proje_id,
            self.model.freelancer_id == freelancer_id,
            self.model.silindi_mi == False
        )
        return proposal
    
    async def count_by_project(self, proje_id: str) -> int:
        count = await self.model.find(
            self.model.proje_id == proje_id,
            self.model.silindi_mi == False
        ).count()
        return count
