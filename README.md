# Freelance Platform

Freelancer ve müşteriler için modern bir mobil uygulama platformu. Proje yönetimi, teklif verme, değerlendirme sistemi, mesajlaşma ve günlük fotoğraf galerisi özelliklerini içerir.

[![Deploy to GitHub Pages](https://github.com/ibrahimcemk/react-native-mobil-uygulama-final-projesi/actions/workflows/deploy.yml/badge.svg)](https://github.com/ibrahimcemk/react-native-mobil-uygulama-final-projesi/actions/workflows/deploy.yml)
[![GitHub Pages](https://img.shields.io/badge/Deploy-GitHub%20Pages-blue)](https://ibrahimcemk.github.io/react-native-mobil-uygulama-final-projesi/)

## 📋 Proje Hakkında

Bu platform, freelancerların projeleri bulmasını, teklif vermesini ve müşterilerle iletişim kurmasını sağlayan kapsamlı bir çözümdür. React Native (Expo) ile geliştirilmiş mobil frontend ve FastAPI tabanlı backend mimarisine sahiptir.

## 🏗️ Teknoloji Yığını

### Backend
- **Framework**: FastAPI 0.104.1
- **Database**: MongoDB
- **ODM**: Beanie 1.23.6
- **Authentication**: JWT (python-jose, passlib)
- **Image Processing**: Pillow, OpenCV
- **File Upload**: aiofiles, python-magic-bin

### Frontend
- **Framework**: React Native 0.83.6
- **Platform**: Expo 55.0.25
- **Navigation**: React Navigation 6.x
- **State Management**: React Hooks
- **HTTP Client**: Axios
- **Image Handling**: expo-image-picker, expo-image-manipulator

## ✨ Özellikler

### 👥 Kullanıcı Yönetimi
- Kayıt ve giriş sistemi (Freelancer/Client rolleri)
- Profil yönetimi
- Profil fotoğrafı yükleme
- JWT tabanlı kimlik doğrulama

### 📁 Kategoriler
- Proje kategorileri yönetimi
- Dinamik kategori sistemi

### 💼 Proje Yönetimi
- Proje oluşturma ve listeleme
- Proje detayları
- Kategori bazlı filtreleme
- Arama özelliği

### 📝 Teklif Sistemi
- Freelancer teklif verme
- Teklif yönetimi
- Durum takibi

### ⭐ Değerlendirme Sistemi
- Freelancer değerlendirmeleri
- Yıldız puanlama sistemi
- Yorum sistemi

### 📸 Fotoğraf Galerisi
- Günlük fotoğraf paylaşımı
- Fotoğraf görüntüleme
- Yorum sistemi
- Resim işleme ve optimizasyon

### 💬 Mesajlaşma
- Gerçek zamanlı mesajlaşma
- Konuşma yönetimi
- Bildirim sistemi

## 🚀 Kurulum

### Backend Kurulumu

1. Sanal ortam oluşturun:
```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
source venv/bin/activate  # Linux/Mac
```

2. Bağımlılıkları yükleyin:
```bash
pip install -r requirements.txt
```

3. Ortam değişkenlerini ayarlayın:
```bash
cp .env.example .env
# .env dosyasını düzenleyin
```

4. MongoDB'yi başlatın ve veritabanını oluşturun:
```bash
python seed_categories.py
python seed_users.py
```

5. Uygulamayı başlatın:
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

API dokümantasyonu: `http://localhost:8000/docs`

### Frontend Kurulumu

1. Bağımlılıkları yükleyin:
```bash
cd frontend
npm install
```

2. Ortam değişkenlerini ayarlayın:
```bash
cp .env.example .env
# .env dosyasını düzenleyin ve API_BASE_URL'yi backend adresinize göre güncelleyin
```

3. Uygulamayı başlatın:
```bash
npm start
```

4. Tarayıcıda açın veya Expo Go uygulamasını kullanın:
- Android/iOS: Expo Go uygulamasını indirin ve QR kodu taratın
- Web: `http://localhost:19006`

## 📁 Proje Yapısı

```
mbl-prj/
├── backend/
│   ├── app/
│   │   ├── core/           # Ayarlar, veritabanı, güvenlik
│   │   ├── features/       # API modülleri
│   │   │   ├── kullanici/  # Kullanıcı yönetimi
│   │   │   ├── kategori/   # Kategori yönetimi
│   │   │   ├── proje/      # Proje yönetimi
│   │   │   ├── teklif/     # Teklif sistemi
│   │   │   ├── inceleme/   # Değerlendirme sistemi
│   │   │   ├── photo/      # Fotoğraf galerisi
│   │   │   └── mesaj/      # Mesajlaşma
│   │   ├── middleware/     # CORS, error handling
│   │   └── main.py         # Ana uygulama
│   ├── uploads/            # Yüklenen dosyalar
│   ├── requirements.txt    # Python bağımlılıkları
│   └── .env.example        # Ortam değişkenleri şablonu
├── frontend/
│   ├── src/
│   │   ├── screens/        # Ekranlar
│   │   ├── components/    # Bileşenler
│   │   ├── navigation/    # Navigasyon
│   │   ├── services/      # API servisleri
│   │   └── utils/         # Yardımcı fonksiyonlar
│   ├── App.js             # Ana uygulama
│   └── package.json       # Node bağımlılıkları
└── README.md
```

## 🔧 Ortam Değişkenleri

### Backend için `.env` dosyası:

```env
MONGODB_URL=mongodb://localhost:27017
DATABASE_NAME=mbl_db
SECRET_KEY=your-secret-key-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
API_PREFIX=/api
PROJECT_NAME=Mobile Backend API
VERSION=1.0.0
BASE_URL=http://localhost:8000
```

### Frontend için `.env` dosyası:

```env
API_BASE_URL=http://localhost:8000/api
```

Not: Mobil cihazdan erişim için `localhost` yerine bilgisayarınızın IP adresini kullanın (örn: `http://192.168.1.4:8000/api`).

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Kayıt ol
- `POST /api/auth/login` - Giriş yap
- `GET /api/auth/me` - Mevcut kullanıcı bilgisi

### Users
- `GET /api/users` - Kullanıcıları listele
- `GET /api/users/{id}` - Kullanıcı detayları
- `PUT /api/users/{id}` - Kullanıcı güncelle
- `POST /api/users/{id}/upload` - Profil fotoğrafı yükle

### Categories
- `GET /api/categories` - Kategorileri listele
- `POST /api/categories` - Kategori oluştur

### Projects
- `GET /api/projects` - Projeleri listele
- `POST /api/projects` - Proje oluştur
- `GET /api/projects/{id}` - Proje detayları
- `PUT /api/projects/{id}` - Proje güncelle
- `DELETE /api/projects/{id}` - Proje sil

### Proposals
- `GET /api/proposals` - Teklifleri listele
- `POST /api/proposals` - Teklif oluştur
- `PUT /api/proposals/{id}` - Teklif güncelle

### Reviews
- `GET /api/reviews` - Değerlendirmeleri listele
- `POST /api/reviews` - Değerlendirme oluştur

### Photos
- `GET /api/photos` - Fotoğrafları listele
- `POST /api/photos` - Fotoğraf yükle
- `GET /api/photos/{id}` - Fotoğraf detayları

### Messages
- `GET /api/messages/conversations` - Konuşmaları listele
- `GET /api/messages/{conversation_id}` - Mesajları getir
- `POST /api/messages` - Mesaj gönder

## 🧪 Test Verileri

Test verilerini yüklemek için:

```bash
cd backend
python seed_categories.py  # Kategorileri yükler
python seed_users.py       # Test kullanıcıları oluşturur
```

## 🛠️ Geliştirme

### Backend
```bash
cd backend
uvicorn app.main:app --reload
```

### Frontend
```bash
cd frontend
npm start
```

## 📝 Lisans

Bu proje kişisel kullanım için geliştirilmiştir.

## 👤 Geliştirici

İbrahim Cem Keleş

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/AmazingFeature`)
3. Commit yapın (`git commit -m 'Add some AmazingFeature'`)
4. Branch'i push edin (`git push origin feature/AmazingFeature`)
5. Pull Request açın

## 🌐 GitHub Pages Deployment

Bu proje GitHub Pages üzerinde otomatik olarak deploy edilir. Her `main` branch'ine push yapıldığında:

1. GitHub Actions workflow tetiklenir
2. Expo web build oluşturulur
3. `frontend/dist/` klasörü GitHub Pages'a deploy edilir

### İlk Kurulum İçin:

1. GitHub reposunda **Settings** > **Pages**'e gidin
2. **Source** olarak **GitHub Actions**'ı seçin
3. Kodu push edin, otomatik deploy başlayacaktır

### Manuel Deploy Test:

```bash
cd frontend
npm run build:web
```

Build çıktısı `frontend/dist/` klasöründe oluşacaktır.
