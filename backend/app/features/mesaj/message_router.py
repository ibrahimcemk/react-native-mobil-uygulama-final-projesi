from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from app.core.security import get_current_user
from app.core.response import success_response, error_response
from .message_manager import MessageManager
from .message_schema import MessageCreateSchema


message_router = APIRouter(prefix="/messages", tags=["messages"])


def message_to_dict(message) -> dict:
   
    return {
        "id": str(message.id),
        "conversation_id": message.conversation_id,
        "gonderen_id": message.gonderen_id,
        "gonderen_adi": message.gonderen_adi,
        "gonderen_profil_resmi": message.gonderen_profil_resmi,
        "alici_id": message.alici_id,
        "mesaj": message.mesaj,
        "okundu_mu": message.okundu_mu,
        "okunma_tarihi": message.okunma_tarihi.isoformat() if message.okunma_tarihi else None,
        "olusturulma_tarihi": message.olusturulma_tarihi.isoformat() if message.olusturulma_tarihi else None,
    }


@message_router.post("/send", status_code=status.HTTP_201_CREATED)
async def send_message(
    data: MessageCreateSchema,
    current_user = Depends(get_current_user)
):
    
    try:
        print(f"💬 Send Message - From: {current_user.ad} ({current_user.id}), To: {data.alici_id}")
        print(f"📝 Mesaj içeriği: {data.mesaj[:50]}...")
        manager = MessageManager()
        
        if data.alici_id == str(current_user.id):
            print(f"❌ Error: User trying to send message to themselves")
            raise HTTPException(
                status_code=400,
                detail="Kendinize mesaj gönderemezsiniz"
            )
        
        message, conversation = await manager.send_message(
            gonderen_id=str(current_user.id),
            gonderen_adi=current_user.ad,
            gonderen_profil_resmi=current_user.profil_resmi,
            alici_id=data.alici_id,
            mesaj=data.mesaj
        )
        
        await manager.update_conversation_cache(
            str(conversation.id),
            str(current_user.id),
            current_user.ad,
            current_user.profil_resmi
        )
        
        print(f"✅ Mesaj başarıyla gönderildi - Message ID: {message.id}, Conversation ID: {conversation.id}")
        return success_response(
            data={
                "message": message_to_dict(message),
                "conversation_id": str(conversation.id)
            },
            message="Mesaj gönderildi"
        )
        
    except HTTPException:
        raise
    except Exception as e:
        import traceback
        print(f"❌ Send Message Error: {str(e)}")
        print(f"🔍 Traceback:\n{traceback.format_exc()}")
        return error_response(str(e), status.HTTP_400_BAD_REQUEST)


@message_router.get("/conversations")
async def get_conversations(
    skip: int = 0,
    limit: int = 20,
    current_user = Depends(get_current_user)
):
   
    try:
        print(f"📝 Get Conversations - User: {current_user.ad} ({current_user.id}), skip: {skip}, limit: {limit}")
        manager = MessageManager()
        conversations = await manager.get_user_conversations(
            str(current_user.id),
            skip,
            limit
        )
        
        print(f"✅ {len(conversations)} konuşma getirildi")
        return success_response(
            data={
                "conversations": conversations,
                "total": len(conversations),
                "skip": skip,
                "limit": limit
            },
            message="Konuşmalar getirildi"
        )
        
    except Exception as e:
        import traceback
        print(f"❌ Get Conversations Error: {str(e)}")
        print(f"🔍 Traceback:\n{traceback.format_exc()}")
        return error_response(str(e), status.HTTP_400_BAD_REQUEST)


@message_router.get("/conversations/{conversation_id}")
async def get_conversation_messages(
    conversation_id: str,
    skip: int = 0,
    limit: int = 50,
    current_user = Depends(get_current_user)
):
    
    try:
        print(f"📨 Get Messages - User: {current_user.ad}, Conversation: {conversation_id}, skip: {skip}, limit: {limit}")
        manager = MessageManager()
        
        conversation = await manager.conversation_repo.get_one(conversation_id)
        if not conversation:
            print(f"❌ Konuşma bulunamadı: {conversation_id}")
            raise HTTPException(status_code=404, detail="Konuşma bulunamadı")
        
        if str(current_user.id) not in conversation.katilimci_ids:
            print(f"❌ Yetkisiz erişim - User {current_user.id} conversation {conversation_id}'ye erişmeye çalıştı")
            raise HTTPException(status_code=403, detail="Bu konuşmaya erişim yetkiniz yok")
        
        messages = await manager.get_conversation_messages(
            conversation_id,
            str(current_user.id),
            skip,
            limit
        )
        
        print(f"✅ {len(messages)} mesaj getirildi ve okundu işaretlendi")
        return success_response(
            data={
                "messages": [message_to_dict(m) for m in reversed(messages)],  
                "total": len(messages),
                "skip": skip,
                "limit": limit
            },
            message="Mesajlar getirildi"
        )
        
    except HTTPException:
        raise
    except Exception as e:
        import traceback
        print(f"❌ Get Messages Error: {str(e)}")
        print(f"🔍 Traceback:\n{traceback.format_exc()}")
        return error_response(str(e), status.HTTP_400_BAD_REQUEST)


@message_router.get("/unread-count")
async def get_unread_count(
    current_user = Depends(get_current_user)
):
   
    try:
        print(f"🔔 Get Unread Count - User: {current_user.ad} ({current_user.id})")
        manager = MessageManager()
        count = await manager.get_unread_message_count(str(current_user.id))
        
        print(f"✅ Okunmamış mesaj sayısı: {count}")
        return success_response(
            data={"count": count},
            message="Okunmamış mesaj sayısı"
        )
        
    except Exception as e:
        import traceback
        print(f"❌ Get Unread Count Error: {str(e)}")
        print(f"🔍 Traceback:\n{traceback.format_exc()}")
        return error_response(str(e), status.HTTP_400_BAD_REQUEST)


@message_router.post("/start-conversation/{user_id}")
async def start_or_get_conversation(
    user_id: str,
    current_user = Depends(get_current_user)
):
    
    try:
        print(f"💬 Start Conversation - Current User: {current_user.ad} ({current_user.id}), Target User: {user_id}")
        manager = MessageManager()
        
        if user_id == str(current_user.id):
            print(f"❌ Error: User trying to chat with themselves")
            raise HTTPException(
                status_code=400,
                detail="Kendinizle konuşma başlatamazsınız"
            )
        
        print(f"🔍 Checking if conversation exists between {current_user.id} and {user_id}")
        conversation = await manager.conversation_repo.find_conversation(
            str(current_user.id),
            user_id
        )
        
        if not conversation:
            print(f"➕ Creating new conversation")
            conversation = await manager._create_conversation(
                str(current_user.id),
                user_id
            )
            print(f"✅ Conversation created - ID: {conversation.id}")
        else:
            print(f"✅ Conversation found - ID: {conversation.id}")
        
        return success_response(
            data={"conversation_id": str(conversation.id)},
            message="Konuşma hazır"
        )
        
    except HTTPException:
        raise
    except Exception as e:
        import traceback
        print(f"❌ Start Conversation Error: {str(e)}")
        print(f"🔍 Traceback:\n{traceback.format_exc()}")
        return error_response(str(e), status.HTTP_400_BAD_REQUEST)
