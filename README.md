# Freelance Platform

Freelancer ve müşteriler için modern bir mobil uygulama platformu. Proje yönetimi, teklif verme, değerlendirme sistemi, mesajlaşma ve günlük fotoğraf galerisi özelliklerini içerir.

[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Kurulum%20Sayfası-blue)](https://ibrahimcemk.github.io/react-native-mobil-uygulama-final-projesi/)
[![GitHub Repo](https://img.shields.io/badge/GitHub-Reposu-black)](https://github.com/ibrahimcemk/react-native-mobil-uygulama-final-projesi)

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

4. Mobil cihazda çalıştırma:
- **Expo Go (Önerilen):**
  - Android/iOS: Expo Go uygulamasını indirin
  - Terminal'de gösterilen QR kodu taratın
  - Uygulama otomatik olarak açılacak

- **Android Emulator:**
  ```bash
  npm run android
  ```

- **iOS Simulator:**
  ```bash
  npm run ios
  ```

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

## 🌐 Production Deployment (Render)

Bu projeyi production ortamında çalıştırmak için Render kullanabilirsiniz:

### Backend Deployment (Render)

1. **Render hesabı oluşturun:** https://render.com/register

2. **Backend'i deploy edin:**
   - Render dashboard'da "New +" > "Web Service" seçin
   - GitHub reposunu bağlayın: `ibrahimcemk/react-native-mobil-uygulama-final-projesi`
   - Root directory: `backend`
   - Build command: `pip install -r requirements.txt`
   - Start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - Environment variables ekleyin:
     - `MONGODB_URL`: Render MongoDB connection string
     - `DATABASE_NAME`: `mbl_db`
     - `SECRET_KEY`: Güçlü bir secret key
     - `ALGORITHM`: `HS256`
     - `ACCESS_TOKEN_EXPIRE_MINUTES`: `30`

3. **MongoDB Database:**
   - Render dashboard'da "New +" > "MongoDB" seçin
   - Connection string'i backend environment variables'a ekleyin

### Frontend Configuration

Production için API URL'yi güncelleyin:

```bash
cd frontend
# .env dosyasını düzenleyin
API_BASE_URL=https://mbl-backend.onrender.com/api
```

### Mobil Uygulama Çalıştırma (Production)

Backend deploy edildikten sonra:

1. **Frontend'i başlatın:**
   ```bash
   cd frontend
   npm start
   ```

2. **Mobil cihazda:**
   - Expo Go uygulamasını indirin
   - QR kodu taratın
   - Uygulama production API'ye bağlanacak

## 🚀 GitHub'da Çalıştırma (Codespaces)

Bu projeyi GitHub'da direkt çalıştırmak için GitHub Codespaces kullanabilirsiniz:

1. **GitHub reposunu açın:** https://github.com/ibrahimcemk/react-native-mobil-uygulama-final-projesi

2. **Codespaces oluştur:**
   - Yeşil "Code" butonuna tıklayın
   - "Codespaces" sekmesine gidin
   - "Create codespace on main" butonuna tıklayın

3. **Otomatik kurulum:**
   - Container otomatik olarak oluşturulacak
   - Backend ve frontend bağımlılıkları otomatik yüklenecek
   - MongoDB container başlatılacak

4. **Uygulamayı başlatın:**
   
   **Windows (PowerShell):**
   ```powershell
   # Terminal 1 - Backend
   cd backend
   .\venv\Scripts\activate
   uvicorn app.main:app --reload

   # Terminal 2 - Frontend
   cd frontend
   npm start
   ```

   **Linux/Mac/Git Bash:**
   ```bash
   # Terminal 1 - Backend
   cd backend
   source venv/bin/activate
   uvicorn app.main:app --reload

   # Terminal 2 - Frontend
   cd frontend
   npm start
   ```

5. **Port forward:**
   - Backend: Port 8000
   - Frontend: Port 19000-19002
   - Portlar otomatik olarak forward edilecek

## �� Mobil Uygulama Çalıştırma

Bu proje Expo ile geliştirilmiştir. Mobil cihazda çalıştırmak için:

### Expo Go ile Çalıştırma (En Kolay)

1. Backend'i başlatın:
```bash
cd backend
uvicorn app.main:app --reload
```

2. Frontend'i başlatın:
```bash
cd frontend
npm start
```

3. Mobil cihazınızda:
   - Android: Expo Go uygulamasını Google Play'den indirin
   - iOS: Expo Go uygulamasını App Store'dan indirin
   - Uygulamayı açın ve terminal'deki QR kodu taratın

### APK Build (Manuel)

APK build oluşturmak için EAS CLI kullanın:

```bash
cd frontend
npm install -g eas-cli
eas build:configure
eas build --platform android
```

Daha fazla bilgi için: https://docs.expo.dev/build/introduction/
