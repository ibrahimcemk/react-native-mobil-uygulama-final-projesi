"""
MongoDB bağlantısını ve koleksiyonları kontrol et
Run with: python check_db.py
"""
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient

async def check_mongodb():
    """MongoDB koleksiyonlarını ve verileri kontrol et"""
    
    client = AsyncIOMotorClient("mongodb://localhost:27017")
    db = client.mbl_db
    
    print("🔍 MongoDB Veritabanı Kontrol\n")
    print("=" * 60)
    
    collections = await db.list_collection_names()
    print(f"\n📊 Koleksiyonlar ({len(collections)}):")
    for col in collections:
        count = await db[col].count_documents({})
        print(f"  - {col}: {count} kayıt")
    
    if "photos" in collections:
        print("\n📸 Photos Koleksiyonu:")
        photos = await db.photos.find().limit(5).to_list(5)
        for photo in photos:
            print(f"  • {photo.get('kullanici_adi', 'Anonim')}: {photo.get('baslik', 'Başlıksız')}")
    
    if "users" in collections:
        print("\n👥 Users Koleksiyonu:")
        users = await db.users.find().limit(5).to_list(5)
        for user in users:
            print(f"  • {user.get('ad')} ({user.get('email')}) - {user.get('rol')}")
    
    if "categories" in collections:
        print("\n📁 Categories Koleksiyonu:")
        categories = await db.categories.find().limit(5).to_list(5)
        for cat in categories:
            print(f"  • {cat.get('ad')} ({cat.get('slug')})")
    
    print("\n" + "=" * 60)
    print("✅ Veritabanı kontrolü tamamlandı!")
    
    client.close()


if __name__ == "__main__":
    asyncio.run(check_mongodb())
