"""
Seed script for creating categories
Run with: python seed_categories.py
"""
import asyncio
from app.core.database import connect_to_mongo, close_mongo_connection, init_db
from app.features.kategori import Category, CategoryManager


async def seed_categories():
    """Kategorileri oluştur"""
    
    await connect_to_mongo()
    await init_db([Category])
    
    manager = CategoryManager()
    
    categories = [
        {
            "ad": "Web Geliştirme",
            "kisa_ad": "web-gelistirme",
            "slug": "web-gelistirme",
            "aciklama": "Web siteleri ve web uygulamaları geliştirme",
            "ikon": "🌐",
            "aktif_mi": True,
        },
        {
            "ad": "Mobil Uygulama",
            "kisa_ad": "mobil-uygulama",
            "slug": "mobil-uygulama",
            "aciklama": "iOS ve Android mobil uygulama geliştirme",
            "ikon": "📱",
            "aktif_mi": True,
        },
        {
            "ad": "UI/UX Tasarım",
            "kisa_ad": "ui-ux-tasarim",
            "slug": "ui-ux-tasarim",
            "aciklama": "Kullanıcı arayüzü ve deneyim tasarımı",
            "ikon": "🎨",
            "aktif_mi": True,
        },
        {
            "ad": "Grafik Tasarım",
            "kisa_ad": "grafik-tasarim",
            "slug": "grafik-tasarim",
            "aciklama": "Logo, afiş, sosyal medya görselleri",
            "ikon": "🖼️",
            "aktif_mi": True,
        },
        {
            "ad": "Yazılım Geliştirme",
            "kisa_ad": "yazilim-gelistirme",
            "slug": "yazilim-gelistirme",
            "aciklama": "Backend, API ve sistem geliştirme",
            "ikon": "💻",
            "aktif_mi": True,
        },
        {
            "ad": "Veri Bilimi",
            "kisa_ad": "veri-bilimi",
            "slug": "veri-bilimi",
            "aciklama": "Veri analizi, makine öğrenimi ve AI",
            "ikon": "📊",
            "aktif_mi": True,
        },
        {
            "ad": "İçerik Yazarlığı",
            "kisa_ad": "icerik-yazarligi",
            "slug": "icerik-yazarligi",
            "aciklama": "Blog, makale ve SEO içerik yazımı",
            "ikon": "✍️",
            "aktif_mi": True,
        },
        {
            "ad": "Dijital Pazarlama",
            "kisa_ad": "dijital-pazarlama",
            "slug": "dijital-pazarlama",
            "aciklama": "SEO, SEM, sosyal medya pazarlama",
            "ikon": "📈",
            "aktif_mi": True,
        },
        {
            "ad": "Video Düzenleme",
            "kisa_ad": "video-duzenleme",
            "slug": "video-duzenleme",
            "aciklama": "Video kurgu, animasyon ve prodüksiyon",
            "ikon": "🎬",
            "aktif_mi": True,
        },
        {
            "ad": "Çeviri",
            "kisa_ad": "ceviri",
            "slug": "ceviri",
            "aciklama": "Profesyonel dil çeviri hizmetleri",
            "ikon": "🌍",
            "aktif_mi": True,
        },
    ]
    
    print("🌱 Kategoriler oluşturuluyor...\n")
    
    created_count = 0
    for cat_data in categories:
        try:
            existing = await Category.find_one(Category.slug == cat_data["slug"])
            if existing:
                print(f"⏭️  {cat_data['ad']} zaten mevcut, atlanıyor...")
                continue
            
            category = await manager.create(cat_data)
            print(f"✅ {cat_data['ad']} - {cat_data['ikon']}")
            created_count += 1
                
        except Exception as e:
            print(f"❌ Hata ({cat_data['ad']}): {str(e)}")
    
    print(f"\n✨ {created_count} kategori oluşturuldu!")
    
    await close_mongo_connection()


if __name__ == "__main__":
    asyncio.run(seed_categories())
