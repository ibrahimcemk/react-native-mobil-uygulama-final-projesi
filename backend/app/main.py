from contextlib import asynccontextmanager
from pathlib import Path
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from app.core import settings, connect_to_mongo, close_mongo_connection, init_db, ensure_upload_dir
from app.core.logger import setup_logging
from app.features import User, user_router, user_file_router
from app.features.kategori import Category, category_router
from app.features.proje import Project, project_router
from app.features.proje.search_router import search_router
from app.features.teklif import Proposal, proposal_router
from app.features.inceleme import Review, review_router
from app.features.photo import Photo, photo_router
from app.features.photo.comment_model import PhotoComment
from app.features.photo.comment_router import comment_router
from app.features.mesaj import Message, Conversation, message_router
from app.middleware import setup_cors
from app.middleware.error_handler import setup_exception_handlers


@asynccontextmanager
async def lifespan(app: FastAPI):
    print("🚀 İbrahim Cem Keleşin Freelance Platform Uygulaması başlatılıyor...")
    
    setup_logging()
    
    ensure_upload_dir()
    print("✅ Upload klasörü hazır")
    
    await connect_to_mongo()
    
    await init_db([User, Category, Project, Proposal, Review, Photo, PhotoComment, Message, Conversation])
    print("✅ Tüm modeller yüklendi (User, Category, Project, Proposal, Review, Photo, PhotoComment, Message, Conversation)")
    
    print(f"✅ {settings.PROJECT_NAME} v{settings.VERSION} hazır!")
    
    yield
    
    await close_mongo_connection()
    print("👋 Uygulama kapatılıyor...")


app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Freelance Platform API - FastAPI, MongoDB, Beanie",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc"
)

setup_cors(app)

setup_exception_handlers(app)


app.include_router(user_router, prefix=settings.API_PREFIX)
app.include_router(user_file_router, prefix=settings.API_PREFIX)
app.include_router(category_router, prefix=settings.API_PREFIX)
app.include_router(project_router, prefix=settings.API_PREFIX)
app.include_router(proposal_router, prefix=settings.API_PREFIX)
app.include_router(review_router, prefix=settings.API_PREFIX)
app.include_router(photo_router, prefix=settings.API_PREFIX)
app.include_router(comment_router, prefix=settings.API_PREFIX)
app.include_router(message_router, prefix=settings.API_PREFIX)
app.include_router(search_router, prefix=settings.API_PREFIX)

ensure_upload_dir()
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")


@app.get("/")
async def root():
    return {
        "message": "🎉 Freelance Platform API çalışıyor!",
        "version": settings.VERSION,
        "docs": "/docs",
        "features": [
            "👥 User Management (Freelancer/Client)",
            "📁 Categories",
            "💼 Projects",
            "📝 Proposals",
            "⭐ Reviews & Ratings",
            "📸 Photo Gallery (Daily Photos)",
            "💬 Messaging System"
        ]
    }


@app.get("/health")
async def health_check():
   
    from datetime import datetime
    
    db_status = "disconnected"
    try:
        await User.find_one().limit(1)
        db_status = "connected"
    except Exception as e:
        print(f"Health check - DB error: {e}")
    
    overall_status = "healthy" if db_status == "connected" else "unhealthy"
    
    return {
        "status": overall_status,
        "database": db_status,
        "timestamp": datetime.utcnow().isoformat(),
        "version": settings.VERSION
    }
