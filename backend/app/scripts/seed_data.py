

import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
import sys
from pathlib import Path

sys.path.append(str(Path(__file__).parent.parent.parent))

from app.core.config import settings
from app.core.security import get_password_hash
from app.features.kullanici.user_model import User


async def seed_users():
    
    print("📝 Kullanıcı verileri oluşturuluyor...")
    
    admin_exists = await User.find_one(User.email == "admin@test.com")
    
    if not admin_exists:
        admin = User(
            ad="Admin User",
            kisa_ad="admin",
            email="admin@test.com",
            sifre_hash=get_password_hash("admin123"),
            rol="admin",
            telefon="5551234567",
            aktif_mi=True
        )
        await admin.insert()
        print("✅ Admin kullanıcı oluşturuldu: admin@test.com / admin123")
    else:
        print("ℹ️  Admin kullanıcı zaten mevcut")
    
    user_exists = await User.find_one(User.email == "user@test.com")
    
    if not user_exists:
        user = User(
            ad="Test User",
            kisa_ad="testuser",
            email="user@test.com",
            sifre_hash=get_password_hash("user123"),
            rol="user",
            telefon="5559876543",
            aktif_mi=True
        )
        await user.insert()
        print("✅ Test kullanıcı oluşturuldu: user@test.com / user123")
    else:
        print("ℹ️  Test kullanıcı zaten mevcut")
    
    for i in range(1, 6):
        email = f"test{i}@test.com"
        exists = await User.find_one(User.email == email)
        
        if not exists:
            test_user = User(
                ad=f"Test User {i}",
                kisa_ad=f"test{i}",
                email=email,
                sifre_hash=get_password_hash("test123"),
                rol="user",
                telefon=f"555{1000000 + i}",
                aktif_mi=True,
                etiketler=["test", f"user{i}"]
            )
            await test_user.insert()
            print(f"✅ Test kullanıcı {i} oluşturuldu: {email} / test123")


async def main():
    print("🌱 Seed data başlatılıyor...")
    print(f"📊 Veritabanı: {settings.DATABASE_NAME}")
    
    client = AsyncIOMotorClient(settings.MONGODB_URL)
    
    await init_beanie(
        database=client[settings.DATABASE_NAME],
        document_models=[User]
    )
    
    await seed_users()
    
    client.close()
    
    print("✅ Seed data tamamlandı!")
    print("\n📋 Test Hesapları:")
    print("  Admin: admin@test.com / admin123")
    print("  User:  user@test.com / user123")
    print("  Test:  test1@test.com / test123 (x5)")


if __name__ == "__main__":
    asyncio.run(main())
