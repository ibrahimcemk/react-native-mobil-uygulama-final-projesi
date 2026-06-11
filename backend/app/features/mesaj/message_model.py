from beanie import Document
from pydantic import Field
from typing import Optional, List
from datetime import datetime
from pymongo import IndexModel, ASCENDING, DESCENDING


class Message(Document):
    conversation_id: str = Field(..., description="Konuşma ID'si")
    gonderen_id: str = Field(..., description="Mesajı gönderen kullanıcı ID")
    gonderen_adi: Optional[str] = Field(None, description="Gönderen adı (cache)")
    gonderen_profil_resmi: Optional[str] = Field(None, description="Gönderen profil resmi (cache)")
    alici_id: str = Field(..., description="Mesajı alan kullanıcı ID")
    mesaj: str = Field(..., description="Mesaj içeriği")
    okundu_mu: bool = Field(default=False, description="Mesaj okundu mu?")
    okunma_tarihi: Optional[datetime] = Field(None, description="Mesajın okunma tarihi")
    olusturulma_tarihi: datetime = Field(default_factory=datetime.utcnow)
    silindi_mi: bool = Field(default=False)
    
    class Settings:
        name = "messages"
        indexes = [
            IndexModel([("conversation_id", ASCENDING)]),
            IndexModel([("gonderen_id", ASCENDING)]),
            IndexModel([("alici_id", ASCENDING)]),
            IndexModel([("olusturulma_tarihi", DESCENDING)]),
            IndexModel([("okundu_mu", ASCENDING)]),
            IndexModel([("silindi_mi", ASCENDING)]),
        ]


class Conversation(Document):
    katilimci_ids: List[str] = Field(..., description="Konuşmaya katılan kullanıcı ID'leri (2 kişi)")
    katilimci_bilgileri: List[dict] = Field(default_factory=list, description="Katılımcıların bilgileri (cache)")
    son_mesaj: Optional[str] = Field(None, description="Son mesaj içeriği")
    son_mesaj_tarihi: Optional[datetime] = Field(None, description="Son mesajın tarihi")
    son_mesaj_gonderen_id: Optional[str] = Field(None, description="Son mesajı gönderen ID")
    okunmamis_mesaj_sayisi: dict = Field(default_factory=dict, description="Her kullanıcı için okunmamış mesaj sayısı")
    olusturulma_tarihi: datetime = Field(default_factory=datetime.utcnow)
    degistirilme_tarihi: datetime = Field(default_factory=datetime.utcnow)
    aktif_mi: bool = Field(default=True)
    silindi_mi: bool = Field(default=False)
    
    class Settings:
        name = "conversations"
        indexes = [
            IndexModel([("katilimci_ids", ASCENDING)]),
            IndexModel([("son_mesaj_tarihi", DESCENDING)]),
            IndexModel([("aktif_mi", ASCENDING)]),
            IndexModel([("silindi_mi", ASCENDING)]),
        ]
