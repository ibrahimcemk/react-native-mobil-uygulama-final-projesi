"""Clear all categories from database"""
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient

async def clear_categories():
    client = AsyncIOMotorClient("mongodb://localhost:27017")
    db = client.mbl_db
    result = await db.categories.delete_many({})
    print(f"✅ {result.deleted_count} kategori silindi")
    client.close()

if __name__ == "__main__":
    asyncio.run(clear_categories())
