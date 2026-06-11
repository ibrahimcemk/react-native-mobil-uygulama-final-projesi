from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from .config import settings


class Database:
    client: AsyncIOMotorClient = None
    
    
db = Database()


async def connect_to_mongo():
    db.client = AsyncIOMotorClient(settings.MONGODB_URL)
    print(f"✅ MongoDB'ye bağlanıldı: {settings.MONGODB_URL}")


async def close_mongo_connection():
    if db.client:
        db.client.close()
        print("❌ MongoDB bağlantısı kapatıldı")


async def init_db(models_list):
    database = db.client[settings.DATABASE_NAME]

    try:
        users_col = database["users"]
        index_info = await users_col.index_information()
        if "email_1" in index_info and not index_info["email_1"].get("unique", False):
            await users_col.drop_index("email_1")
            print("🔄 Eski email_1 index silindi, yeni unique index oluşturulacak")
    except Exception:
        pass

    await init_beanie(
        database=database,
        document_models=models_list
    )
    print(f"✅ Beanie initialized with {len(models_list)} models")


def get_database():
    return db.client[settings.DATABASE_NAME]
