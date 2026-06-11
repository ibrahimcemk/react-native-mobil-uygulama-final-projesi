from typing import List, Optional, Dict
from app.base import BaseManager
from .message_model import Message, Conversation
from .message_repo import MessageRepo, ConversationRepo
from datetime import datetime


class MessageManager(BaseManager[Message]):
    def __init__(self):
        super().__init__(MessageRepo())
        self.conversation_repo = ConversationRepo()
    
    async def send_message(
        self,
        gonderen_id: str,
        gonderen_adi: str,
        gonderen_profil_resmi: Optional[str],
        alici_id: str,
        mesaj: str
    ) -> tuple[Message, Conversation]:
       
        conversation = await self.conversation_repo.find_conversation(gonderen_id, alici_id)
        
        if not conversation:
            conversation = await self._create_conversation(gonderen_id, alici_id)
        
        message_data = {
            "conversation_id": str(conversation.id),
            "gonderen_id": gonderen_id,
            "gonderen_adi": gonderen_adi,
            "gonderen_profil_resmi": gonderen_profil_resmi,
            "alici_id": alici_id,
            "mesaj": mesaj,
        }
        message = await self.repo.create(message_data)
        
        await self.conversation_repo.update_last_message(
            str(conversation.id),
            mesaj,
            gonderen_id
        )
        
        await self.conversation_repo.increment_unread_count(str(conversation.id), alici_id)
        
        conversation = await self.conversation_repo.get_one(str(conversation.id))
        
        return message, conversation
    
    async def _create_conversation(self, user1_id: str, user2_id: str) -> Conversation:
        conversation_data = {
            "katilimci_ids": [user1_id, user2_id],
            "okunmamis_mesaj_sayisi": {user1_id: 0, user2_id: 0}
        }
        conversation = await self.conversation_repo.create(conversation_data)
        return conversation
    
    async def get_conversation_messages(
        self,
        conversation_id: str,
        current_user_id: str,
        skip: int = 0,
        limit: int = 50
    ) -> List[Message]:
        messages = await self.repo.get_conversation_messages(conversation_id, skip, limit)
        
        await self.repo.mark_messages_as_read(conversation_id, current_user_id)
        
        await self.conversation_repo.reset_unread_count(conversation_id, current_user_id)
        
        return messages
    
    async def get_user_conversations(
        self,
        user_id: str,
        skip: int = 0,
        limit: int = 20
    ) -> List[Dict]:
        conversations = await self.conversation_repo.get_user_conversations(user_id, skip, limit)
        
        result = []
        for conv in conversations:
            diger_kullanici_id = None
            for k_id in conv.katilimci_ids:
                if k_id != user_id:
                    diger_kullanici_id = k_id
                    break
            
            diger_kullanici = None
            for k_bilgi in conv.katilimci_bilgileri:
                if k_bilgi.get("id") == diger_kullanici_id:
                    diger_kullanici = k_bilgi
                    break
            
            if not diger_kullanici:
                diger_kullanici = {"id": diger_kullanici_id, "ad": "Kullanıcı", "profil_resmi": None}
            
            okunmamis_sayisi = conv.okunmamis_mesaj_sayisi.get(user_id, 0)
            
            result.append({
                "id": str(conv.id),
                "diger_kullanici": diger_kullanici,
                "son_mesaj": conv.son_mesaj,
                "son_mesaj_tarihi": conv.son_mesaj_tarihi,
                "okunmamis_mesaj_sayisi": okunmamis_sayisi,
                "olusturulma_tarihi": conv.olusturulma_tarihi
            })
        
        return result
    
    async def update_conversation_cache(
        self,
        conversation_id: str,
        user_id: str,
        user_ad: str,
        user_profil_resmi: Optional[str]
    ):
        conversation = await self.conversation_repo.get_one(conversation_id)
        if conversation:
            user_found = False
            for i, k_bilgi in enumerate(conversation.katilimci_bilgileri):
                if k_bilgi.get("id") == user_id:
                    conversation.katilimci_bilgileri[i] = {
                        "id": user_id,
                        "ad": user_ad,
                        "profil_resmi": user_profil_resmi
                    }
                    user_found = True
                    break
            
            if not user_found:
                conversation.katilimci_bilgileri.append({
                    "id": user_id,
                    "ad": user_ad,
                    "profil_resmi": user_profil_resmi
                })
            
            await conversation.save()
    
    async def get_unread_message_count(self, user_id: str) -> int:
        return await self.repo.get_unread_count(user_id)
