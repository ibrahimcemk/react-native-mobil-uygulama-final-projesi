from typing import List, Optional
from app.base import BaseRepo
from .message_model import Message, Conversation
from datetime import datetime


class MessageRepo(BaseRepo[Message]):
    def __init__(self):
        super().__init__(Message)
    
    async def get_conversation_messages(
        self, 
        conversation_id: str, 
        skip: int = 0, 
        limit: int = 50
    ) -> List[Message]:
        messages = await self.model.find(
            self.model.conversation_id == conversation_id,
            self.model.silindi_mi == False
        ).sort(-self.model.olusturulma_tarihi).skip(skip).limit(limit).to_list()
        return messages
    
    async def mark_messages_as_read(
        self, 
        conversation_id: str, 
        alici_id: str
    ) -> int:
        result = await self.model.find(
            self.model.conversation_id == conversation_id,
            self.model.alici_id == alici_id,
            self.model.okundu_mu == False
        ).update({"$set": {
            "okundu_mu": True,
            "okunma_tarihi": datetime.utcnow()
        }})
        return result.modified_count
    
    async def get_unread_count(self, user_id: str) -> int:
        count = await self.model.find(
            self.model.alici_id == user_id,
            self.model.okundu_mu == False,
            self.model.silindi_mi == False
        ).count()
        return count


class ConversationRepo(BaseRepo[Conversation]):
    def __init__(self):
        super().__init__(Conversation)
    
    async def get_user_conversations(
        self, 
        user_id: str, 
        skip: int = 0, 
        limit: int = 20
    ) -> List[Conversation]:
        conversations = await self.model.find(
            self.model.katilimci_ids == user_id,
            self.model.silindi_mi == False,
            self.model.aktif_mi == True
        ).sort(-self.model.son_mesaj_tarihi).skip(skip).limit(limit).to_list()
        return conversations
    
    async def find_conversation(self, user1_id: str, user2_id: str) -> Optional[Conversation]:
        conversation = await self.model.find_one({
            "katilimci_ids": {"$all": [user1_id, user2_id]},
            "silindi_mi": False
        })
        return conversation
    
    async def update_last_message(
        self, 
        conversation_id: str, 
        mesaj: str, 
        gonderen_id: str
    ):
        conversation = await self.get_one(conversation_id)
        if conversation:
            conversation.son_mesaj = mesaj
            conversation.son_mesaj_tarihi = datetime.utcnow()
            conversation.son_mesaj_gonderen_id = gonderen_id
            conversation.degistirilme_tarihi = datetime.utcnow()
            await conversation.save()
    
    async def increment_unread_count(self, conversation_id: str, alici_id: str):
        conversation = await self.get_one(conversation_id)
        if conversation:
            if alici_id not in conversation.okunmamis_mesaj_sayisi:
                conversation.okunmamis_mesaj_sayisi[alici_id] = 0
            conversation.okunmamis_mesaj_sayisi[alici_id] += 1
            await conversation.save()
    
    async def reset_unread_count(self, conversation_id: str, user_id: str):
        conversation = await self.get_one(conversation_id)
        if conversation:
            conversation.okunmamis_mesaj_sayisi[user_id] = 0
            await conversation.save()
