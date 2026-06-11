from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


class MessageSchema(BaseModel):
    id: str
    conversation_id: str
    gonderen_id: str
    gonderen_adi: Optional[str] = None
    gonderen_profil_resmi: Optional[str] = None
    alici_id: str
    mesaj: str
    okundu_mu: bool = False
    okunma_tarihi: Optional[datetime] = None
    olusturulma_tarihi: datetime
    
    model_config = {"from_attributes": True}


class MessageCreateSchema(BaseModel):
    alici_id: str
    mesaj: str


class ConversationSchema(BaseModel):
    id: str
    katilimci_ids: List[str]
    katilimci_bilgileri: List[dict] = []
    son_mesaj: Optional[str] = None
    son_mesaj_tarihi: Optional[datetime] = None
    son_mesaj_gonderen_id: Optional[str] = None
    okunmamis_mesaj_sayisi: dict = {}
    olusturulma_tarihi: datetime
    degistirilme_tarihi: datetime
    
    model_config = {"from_attributes": True}


class ConversationDetailSchema(BaseModel):
    id: str
    diger_kullanici: dict  
    son_mesaj: Optional[str] = None
    son_mesaj_tarihi: Optional[datetime] = None
    okunmamis_mesaj_sayisi: int = 0
    olusturulma_tarihi: datetime
