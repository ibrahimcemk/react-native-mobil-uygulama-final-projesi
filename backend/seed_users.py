"""
Seed script for creating test users
Run with: python seed_users.py
"""
import asyncio
from app.core.database import connect_to_mongo, close_mongo_connection, init_db
from app.features.kullanici import User, UserManager
from app.core.security import get_password_hash


async def seed_test_users():
    """Test kullanıcıları oluştur"""
    
    await connect_to_mongo()
    await init_db([User])
    
    manager = UserManager()
    
    test_users = [
        {
            "email": "admin@test.com",
            "sifre": "admin123",
            "ad": "Admin User",
            "kisa_ad": "admin",
            "rol": "admin",
            "telefon": "05001112233",
            "aciklama": "Platform yöneticisi",
        },
        {
            "email": "client@test.com",
            "sifre": "client123",
            "ad": "Ahmet Yılmaz",
            "kisa_ad": "ahmet",
            "rol": "client",
            "telefon": "05001234567",
            "sirket_adi": "Yılmaz Teknoloji A.Ş.",
            "aciklama": "İş veren - Teknoloji şirketi",
        },
        {
            "email": "freelancer@test.com",
            "sifre": "freelancer123",
            "ad": "Ayşe Demir",
            "kisa_ad": "ayse",
            "rol": "freelancer",
            "telefon": "05009876543",
            "baslik": "Full Stack Developer",
            "bio": "5 yıllık deneyime sahip full stack geliştirici. React, Node.js, Python ve MongoDB uzmanı.",
            "beceriler": ["React", "Node.js", "Python", "MongoDB", "FastAPI", "React Native"],
            "saatlik_ucret": 150.0,
            "lokasyon": "Istanbul, Türkiye",
            "aciklama": "Freelance developer",
        },
        {
            "email": "client2@test.com",
            "sifre": "client123",
            "ad": "Mehmet Kaya",
            "kisa_ad": "mehmet",
            "rol": "client",
            "telefon": "05005556677",
            "sirket_adi": "Kaya E-ticaret",
            "aciklama": "E-ticaret şirketi sahibi",
        },
        {
            "email": "freelancer2@test.com",
            "sifre": "freelancer123",
            "ad": "Zeynep Arslan",
            "kisa_ad": "zeynep",
            "rol": "freelancer",
            "telefon": "05007778899",
            "baslik": "UI/UX Designer & Frontend Developer",
            "bio": "Kullanıcı deneyimi odaklı tasarım ve frontend geliştirme. Figma, Adobe XD ve React konusunda uzman.",
            "beceriler": ["UI/UX Design", "Figma", "Adobe XD", "React", "TailwindCSS", "Animation"],
            "saatlik_ucret": 120.0,
            "lokasyon": "Ankara, Türkiye",
            "aciklama": "UI/UX Designer & Developer",
        },
        {
            "email": "freelancer3@test.com",
            "sifre": "freelancer123",
            "ad": "Can Özdemir",
            "kisa_ad": "can",
            "rol": "freelancer",
            "telefon": "05003334455",
            "baslik": "Mobile App Developer",
            "bio": "React Native ve Flutter ile mobil uygulama geliştirme uzmanı. 50+ proje tamamladım.",
            "beceriler": ["React Native", "Flutter", "Firebase", "iOS", "Android", "API Integration"],
            "saatlik_ucret": 140.0,
            "lokasyon": "Izmir, Türkiye",
            "ortalama_puan": 4.8,
            "tamamlanan_is_sayisi": 52,
            "toplam_inceleme": 48,
            "aciklama": "Mobile developer",
        },
    ]
    
    print("🌱 Test kullanıcıları oluşturuluyor...\n")
    
    for user_data in test_users:
        try:
            existing = await manager.repo.get_by_email(user_data["email"])
            if existing:
                print(f"⏭️  {user_data['email']} zaten mevcut, atlanıyor...")
                continue
            
            register_data = {
                "email": user_data["email"],
                "sifre": user_data["sifre"],
                "ad": user_data["ad"],
                "kisa_ad": user_data["kisa_ad"],
                "rol": user_data["rol"],
                "telefon": user_data.get("telefon"),
            }
            
            user = await manager.register(register_data)
            
            update_data = {}
            for key in ["sirket_adi", "baslik", "bio", "beceriler", "saatlik_ucret", 
                       "lokasyon", "ortalama_puan", "tamamlanan_is_sayisi", 
                       "toplam_inceleme", "aciklama"]:
                if key in user_data:
                    update_data[key] = user_data[key]
            
            if update_data:
                await manager.update(user.id, update_data)
            
            print(f"✅ {user_data['ad']} ({user_data['rol']}) - {user_data['email']}")
                
        except Exception as e:
            print(f"❌ Hata ({user_data['email']}): {str(e)}")
    
    print("\n✨ Seed işlemi tamamlandı!")
    print("\n📋 Test Hesapları:")
    print("=" * 60)
    print("Admin:        admin@test.com        / admin123")
    print("Client 1:     client@test.com       / client123")
    print("Client 2:     client2@test.com      / client123")
    print("Freelancer 1: freelancer@test.com   / freelancer123")
    print("Freelancer 2: freelancer2@test.com  / freelancer123")
    print("Freelancer 3: freelancer3@test.com  / freelancer123")
    print("=" * 60)
    
    await close_mongo_connection()


if __name__ == "__main__":
    asyncio.run(seed_test_users())
