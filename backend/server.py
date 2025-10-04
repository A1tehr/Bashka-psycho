from fastapi import FastAPI, APIRouter, HTTPException, Depends, Body
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, time
from enum import Enum
from auth import get_current_admin, verify_admin_credentials, create_access_token
from email_service import send_email, send_bulk_email


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI(
    title="Psychology Center Development API",
    description="API for Psychology Center website with programs, appointments, blog, and more",
    version="2.0.0"
)

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Enums
class ProgramType(str, Enum):
    PRESCHOOL = "preschool"
    EARLY_DEVELOPMENT = "early_development"
    INDIVIDUAL_CHILD = "individual_child"
    INDIVIDUAL_ADULT = "individual_adult"
    GROUP_CHILD = "group_child"
    GOAL_SETTING = "goal_setting"

class AppointmentStatus(str, Enum):
    PENDING = "pending"
    CONFIRMED = "confirmed"
    COMPLETED = "completed"
    CANCELLED = "cancelled"

# Models
class Program(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    type: ProgramType
    title: str
    description: str
    goals: List[str]
    age_range: str
    price: int
    duration: str
    faq: List[dict]  # [{"question": "...", "answer": "..."}]
    image_url: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

class ProgramCreate(BaseModel):
    type: ProgramType
    title: str
    description: str
    goals: List[str]
    age_range: str
    price: int
    duration: str
    faq: List[dict]
    image_url: str

class Appointment(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    program_id: str
    client_name: str
    client_phone: str
    client_email: EmailStr
    child_name: Optional[str] = None
    child_age: Optional[int] = None
    preferred_date: datetime
    preferred_time: str
    message: Optional[str] = None
    status: AppointmentStatus = AppointmentStatus.PENDING
    created_at: datetime = Field(default_factory=datetime.utcnow)

class AppointmentCreate(BaseModel):
    program_id: str
    client_name: str
    client_phone: str
    client_email: EmailStr
    child_name: Optional[str] = None
    child_age: Optional[int] = None
    preferred_date: datetime
    preferred_time: str
    message: Optional[str] = None

class AppointmentStatusUpdate(BaseModel):
    status: AppointmentStatus

class Contact(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: EmailStr
    phone: Optional[str] = None
    subject: str
    message: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

class ContactCreate(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None
    subject: str
    message: str

class Newsletter(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: EmailStr
    subscribed_at: datetime = Field(default_factory=datetime.utcnow)

class NewsletterCreate(BaseModel):
    email: EmailStr

class BlogPost(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    slug: str
    excerpt: str
    content: str
    author: str
    tags: List[str]
    image_url: str
    published: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class BlogPostCreate(BaseModel):
    title: str
    slug: str
    excerpt: str
    content: str
    author: str
    tags: List[str]
    image_url: str
    published: bool = False

class SiteSettings(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    phone: str
    email: EmailStr
    address: str
    work_schedule: str
    vk_link: str
    privacy_policy: str
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class SiteSettingsUpdate(BaseModel):
    phone: Optional[str] = None
    email: Optional[EmailStr] = None
    address: Optional[str] = None
    work_schedule: Optional[str] = None
    vk_link: Optional[str] = None
    privacy_policy: Optional[str] = None

class LoginRequest(BaseModel):
    username: str
    password: str

class EmailBroadcast(BaseModel):
    subject: str
    html_content: str

# Auth Routes
@api_router.post("/admin/login")
async def admin_login(login_data: LoginRequest):
    """Admin login endpoint"""
    if verify_admin_credentials(login_data.username, login_data.password):
        access_token = create_access_token(data={"sub": login_data.username})
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "username": login_data.username
        }
    raise HTTPException(status_code=401, detail="Invalid credentials")

@api_router.get("/admin/verify")
async def verify_admin(current_admin: dict = Depends(get_current_admin)):
    """Verify admin token"""
    return {"valid": True, "username": current_admin["username"]}

# Public Routes (no auth required)
@api_router.get("/")
async def root():
    return {"message": "Psychology Center Development API v2.0"}

# Programs endpoints
@api_router.get("/programs", response_model=List[Program])
async def get_programs():
    programs = await db.programs.find().to_list(1000)
    return [Program(**program) for program in programs]

@api_router.get("/programs/{program_id}", response_model=Program)
async def get_program(program_id: str):
    program = await db.programs.find_one({"id": program_id})
    if not program:
        raise HTTPException(status_code=404, detail="Program not found")
    return Program(**program)

# Protected endpoint - only admin can create programs
@api_router.post("/programs", response_model=Program)
async def create_program(
    program_data: ProgramCreate,
    current_admin: dict = Depends(get_current_admin)
):
    program = Program(**program_data.dict())
    await db.programs.insert_one(program.dict())
    return program

# Protected endpoint - only admin can update programs
@api_router.put("/programs/{program_id}", response_model=Program)
async def update_program(
    program_id: str,
    program_data: ProgramCreate,
    current_admin: dict = Depends(get_current_admin)
):
    program = await db.programs.find_one({"id": program_id})
    if not program:
        raise HTTPException(status_code=404, detail="Program not found")
    
    updated_program = Program(**program_data.dict(), id=program_id, created_at=program["created_at"])
    await db.programs.replace_one({"id": program_id}, updated_program.dict())
    return updated_program

# Protected endpoint - only admin can delete programs
@api_router.delete("/programs/{program_id}")
async def delete_program(
    program_id: str,
    current_admin: dict = Depends(get_current_admin)
):
    result = await db.programs.delete_one({"id": program_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Program not found")
    return {"message": "Program deleted successfully"}

# Appointments endpoints
# Protected - only admin can view all appointments
@api_router.get("/appointments", response_model=List[Appointment])
async def get_appointments(current_admin: dict = Depends(get_current_admin)):
    appointments = await db.appointments.find().sort("created_at", -1).to_list(1000)
    return [Appointment(**appointment) for appointment in appointments]

# Public - users can create appointments
@api_router.post("/appointments", response_model=Appointment)
async def create_appointment(appointment_data: AppointmentCreate):
    # Check if program exists
    program = await db.programs.find_one({"id": appointment_data.program_id})
    if not program:
        raise HTTPException(status_code=404, detail="Program not found")
    
    appointment = Appointment(**appointment_data.dict())
    await db.appointments.insert_one(appointment.dict())
    return appointment

# Protected - only admin can update status
@api_router.put("/appointments/{appointment_id}/status")
async def update_appointment_status(
    appointment_id: str,
    status_update: AppointmentStatusUpdate,
    current_admin: dict = Depends(get_current_admin)
):
    result = await db.appointments.update_one(
        {"id": appointment_id},
        {"$set": {"status": status_update.status}}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Appointment not found")
    return {"message": "Status updated successfully"}

# Contact form endpoints
# Public - users can submit contact forms
@api_router.post("/contacts", response_model=Contact)
async def create_contact(contact_data: ContactCreate):
    contact = Contact(**contact_data.dict())
    await db.contacts.insert_one(contact.dict())
    return contact

# Protected - only admin can view contacts
@api_router.get("/contacts", response_model=List[Contact])
async def get_contacts(current_admin: dict = Depends(get_current_admin)):
    contacts = await db.contacts.find().sort("created_at", -1).to_list(1000)
    return [Contact(**contact) for contact in contacts]

# Newsletter endpoints
# Public - users can subscribe
@api_router.post("/newsletter", response_model=Newsletter)
async def subscribe_newsletter(subscription_data: NewsletterCreate):
    # Check if email already exists
    existing = await db.newsletter.find_one({"email": subscription_data.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already subscribed")
    
    subscription = Newsletter(**subscription_data.dict())
    await db.newsletter.insert_one(subscription.dict())
    return subscription

# Protected - only admin can view subscribers
@api_router.get("/newsletter", response_model=List[Newsletter])
async def get_newsletter_subscriptions(current_admin: dict = Depends(get_current_admin)):
    subscriptions = await db.newsletter.find().sort("subscribed_at", -1).to_list(1000)
    return [Newsletter(**subscription) for subscription in subscriptions]

# Protected - only admin can send newsletter
@api_router.post("/newsletter/send")
async def send_newsletter(
    email_data: EmailBroadcast,
    current_admin: dict = Depends(get_current_admin)
):
    # Get all subscribers
    subscriptions = await db.newsletter.find().to_list(1000)
    if not subscriptions:
        raise HTTPException(status_code=404, detail="No subscribers found")
    
    recipient_emails = [sub["email"] for sub in subscriptions]
    
    # Send emails
    results = await send_bulk_email(
        recipients=recipient_emails,
        subject=email_data.subject,
        html_content=email_data.html_content
    )
    
    return results

# Blog endpoints
# Public - anyone can read published posts
@api_router.get("/blog", response_model=List[BlogPost])
async def get_blog_posts(published_only: bool = True):
    filter_query = {"published": True} if published_only else {}
    posts = await db.blog_posts.find(filter_query).sort("created_at", -1).to_list(1000)
    return [BlogPost(**post) for post in posts]

@api_router.get("/blog/{slug}", response_model=BlogPost)
async def get_blog_post(slug: str):
    post = await db.blog_posts.find_one({"slug": slug})
    if not post:
        raise HTTPException(status_code=404, detail="Blog post not found")
    return BlogPost(**post)

# Protected - only admin can create/update posts
@api_router.post("/blog", response_model=BlogPost)
async def create_blog_post(
    post_data: BlogPostCreate,
    current_admin: dict = Depends(get_current_admin)
):
    # Check if slug already exists
    existing = await db.blog_posts.find_one({"slug": post_data.slug})
    if existing:
        raise HTTPException(status_code=400, detail="Slug already exists")
    
    post = BlogPost(**post_data.dict())
    await db.blog_posts.insert_one(post.dict())
    return post

@api_router.put("/blog/{post_id}", response_model=BlogPost)
async def update_blog_post(
    post_id: str,
    post_data: BlogPostCreate,
    current_admin: dict = Depends(get_current_admin)
):
    post = await db.blog_posts.find_one({"id": post_id})
    if not post:
        raise HTTPException(status_code=404, detail="Blog post not found")
    
    updated_post = BlogPost(**post_data.dict(), id=post_id, created_at=post["created_at"])
    updated_post.updated_at = datetime.utcnow()
    
    await db.blog_posts.replace_one({"id": post_id}, updated_post.dict())
    return updated_post

# Protected - only admin can delete blog posts
@api_router.delete("/blog/{post_id}")
async def delete_blog_post(
    post_id: str,
    current_admin: dict = Depends(get_current_admin)
):
    result = await db.blog_posts.delete_one({"id": post_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Blog post not found")
    return {"message": "Blog post deleted successfully"}

# Site Settings endpoints
@api_router.get("/settings", response_model=SiteSettings)
async def get_settings():
    """Get site settings - public endpoint"""
    settings = await db.site_settings.find_one()
    if not settings:
        # Return default settings
        return SiteSettings(
            phone="+7 (495) 123-45-67",
            email="info@psychocenter.ru",
            address="Москва, ул. Примерная, д. 10",
            work_schedule="Пн-Пт: 9:00 - 20:00, Сб-Вс: 10:00 - 18:00",
            vk_link="https://vk.com/psychocenter",
            privacy_policy="<p>Политика конфиденциальности</p>"
        )
    return SiteSettings(**settings)

@api_router.put("/settings")
async def update_settings(
    settings_data: SiteSettingsUpdate,
    current_admin: dict = Depends(get_current_admin)
):
    """Update site settings - admin only"""
    existing = await db.site_settings.find_one()
    
    if existing:
        # Update existing settings
        update_data = {k: v for k, v in settings_data.dict().items() if v is not None}
        update_data["updated_at"] = datetime.utcnow()
        
        await db.site_settings.update_one(
            {"id": existing["id"]},
            {"$set": update_data}
        )
        
        updated = await db.site_settings.find_one({"id": existing["id"]})
        return SiteSettings(**updated)
    else:
        # Create new settings
        new_settings = SiteSettings(**settings_data.dict(exclude_none=True))
        await db.site_settings.insert_one(new_settings.dict())
        return new_settings

# Initialize default data
@app.on_event("startup")
async def initialize_data():
    # Check if programs already exist
    existing_programs = await db.programs.count_documents({})
    if existing_programs == 0:
        # Default programs data
        default_programs = [
            {
                "type": "preschool",
                "title": "Дошкольная подготовка 4-7 лет",
                "description": "Комплексная программа подготовки к школе, которая развивает интеллектуальные способности ребенка и формирует психологическую готовность к обучению.",
                "goals": [
                    "Развитие внимания, памяти и мышления",
                    "Формирование навыков чтения и счета",
                    "Развитие мелкой моторики и координации",
                    "Социальная адаптация и коммуникативные навыки",
                    "Эмоциональная подготовка к школе"
                ],
                "age_range": "4-7 лет",
                "price": 2900,
                "duration": "60 минут",
                "faq": [
                    {"question": "Как долго длится курс?", "answer": "Курс рассчитан на учебный год (сентябрь-май), занятия проходят 2 раза в неделю."},
                    {"question": "Нужны ли дополнительные материалы?", "answer": "Все необходимые материалы предоставляются центром."},
                    {"question": "Что включает в себя занятие?", "answer": "Развитие речи, математические представления, подготовка руки к письму, творческие задания."}
                ],
                "image_url": "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800&auto=format&fit=crop"
            },
            {
                "type": "early_development",
                "title": "Раннее развитие 7-16 лет",
                "description": "Программа развития ключевых когнитивных и социальных навыков для школьников, повышение успеваемости и уверенности в себе.",
                "goals": [
                    "Развитие логического и творческого мышления",
                    "Улучшение концентрации внимания",
                    "Повышение мотивации к обучению",
                    "Развитие социальных навыков",
                    "Формирование уверенности в себе"
                ],
                "age_range": "7-16 лет",
                "price": 2900,
                "duration": "60 минут",
                "faq": [
                    {"question": "Подходит ли программа для детей с трудностями в обучении?", "answer": "Да, программа адаптируется под индивидуальные потребности каждого ребенка."},
                    {"question": "Как часто проходят занятия?", "answer": "Рекомендуется 1-2 раза в неделю в зависимости от потребностей ребенка."},
                    {"question": "Видны ли результаты сразу?", "answer": "Первые положительные изменения обычно заметны через 4-6 занятий."}
                ],
                "image_url": "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=800&auto=format&fit=crop"
            },
            {
                "type": "individual_child",
                "title": "Индивидуальное консультирование детей 10+",
                "description": "Персональная работа с детьми для решения учебных и эмоциональных трудностей, развития личностных качеств.",
                "goals": [
                    "Повышение школьной успеваемости",
                    "Развитие логического и креативного мышления",
                    "Улучшение коммуникативных навыков",
                    "Повышение эмоционального интеллекта",
                    "Рост уверенности и самостоятельности"
                ],
                "age_range": "10+ лет",
                "price": 2900,
                "duration": "50 минут",
                "faq": [
                    {"question": "Как проходит первая консультация?", "answer": "Первая встреча включает знакомство, диагностику и составление индивидуального плана работы."},
                    {"question": "Сколько консультаций потребуется?", "answer": "Количество встреч определяется индивидуально, обычно от 5 до 15 сессий."},
                    {"question": "Участвуют ли родители в процессе?", "answer": "Да, родители получают рекомендации и участвуют в некоторых сессиях."}
                ],
                "image_url": "https://images.unsplash.com/photo-1516534775068-ba3e7458af70?w=800&auto=format&fit=crop"
            },
            {
                "type": "individual_adult",
                "title": "Индивидуальное консультирование взрослых 18+",
                "description": "Психологическая поддержка и развитие взрослых: работа с эмоциями, отношениями, карьерой и личностным ростом.",
                "goals": [
                    "Решение личностных проблем",
                    "Улучшение отношений с окружающими",
                    "Профессиональное развитие",
                    "Работа со стрессом и тревожностью",
                    "Повышение качества жизни"
                ],
                "age_range": "18+ лет",
                "price": 2900,
                "duration": "50 минут",
                "faq": [
                    {"question": "Конфиденциальность гарантирована?", "answer": "Да, все консультации проходят в строгой конфиденциальности согласно этическому кодексу психолога."},
                    {"question": "Можно ли проводить консультации онлайн?", "answer": "Да, возможны как очные, так и онлайн консультации."},
                    {"question": "Что происходит на первой встрече?", "answer": "Знакомство, обсуждение запроса, постановка целей и планирование дальнейшей работы."}
                ],
                "image_url": "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&auto=format&fit=crop"
            },
            {
                "type": "group_child",
                "title": "Групповые занятия для детей 8+",
                "description": "Развивающие групповые занятия для детей, направленные на социализацию, коммуникацию и личностный рост.",
                "goals": [
                    "Развитие навыков общения",
                    "Работа в команде",
                    "Повышение самооценки",
                    "Развитие эмпатии",
                    "Социальная адаптация"
                ],
                "age_range": "8+ лет",
                "price": 2900,
                "duration": "90 минут",
                "faq": [
                    {"question": "Сколько детей в группе?", "answer": "Группы формируются из 4-6 детей близкого возраста."},
                    {"question": "Как формируются группы?", "answer": "Группы комплектуются с учетом возраста, уровня развития и совместимости детей."},
                    {"question": "Что если ребенок стесняется?", "answer": "Наши специалисты помогают застенчивым детям постепенно включиться в групповую работу."}
                ],
                "image_url": "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&auto=format&fit=crop"
            },
            {
                "type": "goal_setting",
                "title": "Развитие целеполагания (тайм-менеджмент)",
                "description": "Программа обучения навыкам планирования, организации времени и достижения целей для подростков и взрослых.",
                "goals": [
                    "Формирование навыков планирования",
                    "Эффективное управление временем",
                    "Постановка и достижение целей",
                    "Повышение продуктивности",
                    "Развитие самодисциплины"
                ],
                "age_range": "14+ лет",
                "price": 2900,
                "duration": "60 минут",
                "faq": [
                    {"question": "Подходит ли программа для подростков?", "answer": "Да, программа адаптирована как для подростков (от 14 лет), так и для взрослых."},
                    {"question": "Какие инструменты изучаются?", "answer": "Изучаются различные методики планирования, техники тайм-менеджмента и целеполагания."},
                    {"question": "Нужна ли предварительная подготовка?", "answer": "Никакой специальной подготовки не требуется, программа построена от простого к сложному."}
                ],
                "image_url": "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&auto=format&fit=crop"
            }
        ]
        
        # Insert default programs
        for program_data in default_programs:
            program = Program(**program_data)
            await db.programs.insert_one(program.dict())
    
    # Initialize blog posts if not exist
    existing_posts = await db.blog_posts.count_documents({})
    if existing_posts == 0:
        sample_blog_posts = [
            {
                "title": "Как подготовить ребенка к школе: психологические аспекты",
                "slug": "kak-podgotovit-rebenka-k-shkole",
                "excerpt": "Психологическая готовность к школе не менее важна, чем умение читать и считать. Рассказываем, на что обратить внимание.",
                "content": "Подготовка к школе — это не только обучение чтению, письму и счету. Психологическая готовность играет не менее важную роль в успешной адаптации ребенка к школьной жизни. Это включает в себя эмоциональную зрелость, способность концентрировать внимание, социальные навыки и мотивацию к обучению. В нашем центре мы работаем над всеми аспектами школьной готовности, помогая детям чувствовать себя уверенно в новой среде.",
                "author": "Детский психолог центра",
                "tags": ["дошкольная подготовка", "психология", "развитие детей"],
                "image_url": "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800&auto=format&fit=crop",
                "published": True
            },
            {
                "title": "Эмоциональный интеллект у детей: как развивать",
                "slug": "emotsionalnyy-intellekt-u-detey",
                "excerpt": "Эмоциональный интеллект играет ключевую роль в успешности ребенка. Узнайте, как его развивать.",
                "content": "Эмоциональный интеллект — это способность понимать и управлять своими эмоциями, а также эффективно взаимодействовать с окружающими. Дети с развитым эмоциональным интеллектом лучше справляются со стрессом, имеют более качественные отношения с друзьями и взрослыми, показывают лучшие результаты в учебе. Развитие эмоционального интеллекта начинается с раннего возраста и продолжается всю жизнь.",
                "author": "Семейный психолог",
                "tags": ["эмоциональный интеллект", "воспитание", "психология детей"],
                "image_url": "https://images.unsplash.com/photo-1537714196752-3f0bc4eb98d3?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHwzfHxwc3ljaG9sb2d5JTIwZGV2ZWxvcG1lbnR8ZW58MHx8fGJsdWV8MTc1OTE1MDQ0NHww&ixlib=rb-4.1.0&q=85",
                "published": True
            },
            {
                "title": "Тайм-менеджмент для подростков: с чего начать",
                "slug": "taym-menedzhment-dlya-podrostkov",
                "excerpt": "Научите подростка управлять своим временем — это поможет ему в учебе и жизни.",
                "content": "Подростковый возраст — время больших изменений и новых задач. Учеба становится сложнее, появляются дополнительные обязанности, хобби и социальная жизнь. Умение эффективно планировать время становится критически важным навыком. Мы учим подростков техникам планирования, постановки целей и приоритизации задач, которые помогут им не только в школе, но и во взрослой жизни.",
                "author": "Психолог-консультант",
                "tags": ["тайм-менеджмент", "подростки", "планирование"],
                "image_url": "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&auto=format&fit=crop",
                "published": True
            },
            {
                "title": "Работа с тревожностью у взрослых: методы и подходы",
                "slug": "rabota-s-trevozhnostyu-u-vzroslykh",
                "excerpt": "Тревожность — распространенная проблема современного мира. Изучаем эффективные методы работы с тревогой.",
                "content": "Тревожность может значительно снижать качество жизни, влиять на работоспособность и отношения с близкими. Важно понимать, что тревога — это нормальная реакция организма на стресс, но когда она становится чрезмерной, необходима помощь специалиста. Современная психология предлагает множество эффективных методов работы с тревожностью: когнитивно-поведенческая терапия, техники релаксации, mindfulness-практики.",
                "author": "Клинический психолог",
                "tags": ["тревожность", "взрослые", "стресс", "терапия"],
                "image_url": "https://images.unsplash.com/photo-1699091871413-afdf712fd616?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHwzfHx0aGVyYXB5JTIwY2hpbGRyZW58ZW58MHx8fGJsdWV8MTc1OTE1MDQ1MHww&ixlib=rb-4.1.0&q=85",
                "published": True
            },
            {
                "title": "Важность групповых занятий для социального развития детей",
                "slug": "vazhnost-gruppovykh-zanyatiy-dlya-detey",
                "excerpt": "Групповые занятия помогают детям развивать социальные навыки и учиться взаимодействовать с ровесниками.",
                "content": "В современном мире дети часто проводят много времени за экранами и меньше взаимодействуют с ровесниками. Групповые занятия в психологическом центре предоставляют безопасную среду для развития социальных навыков. Дети учатся работать в команде, разрешать конфликты, выражать свои мысли и чувства, развивают эмпатию и лидерские качества. Эти навыки критически важны для успешной социальной адаптации.",
                "author": "Детский психолог",
                "tags": ["групповые занятия", "социальные навыки", "дети", "развитие"],
                "image_url": "https://images.pexels.com/photos/6075005/pexels-photo-6075005.jpeg",
                "published": True
            },
            {
                "title": "Как помочь ребенку справиться с учебными трудностями",
                "slug": "kak-pomoch-rebenku-spravitsya-s-uchebnymi-trudnostyami",
                "excerpt": "Учебные трудности у детей — частое явление. Рассказываем, как родители могут помочь своему ребенку.",
                "content": "Каждый ребенок уникален и имеет свой темп развития. Некоторые дети легко усваивают новый материал, другим требуется больше времени и поддержки. Важно помнить, что учебные трудности не означают низкий интеллект. Часто проблемы связаны с особенностями внимания, памяти, мотивации или эмоциональным состоянием. Индивидуальный подход и профессиональная поддержка помогают каждому ребенку раскрыть свой потенциал.",
                "author": "Педагог-психолог",
                "tags": ["учебные трудности", "дети", "обучение", "поддержка"],
                "image_url": "https://images.pexels.com/photos/6075006/pexels-photo-6075006.jpeg",
                "published": True
            }
        ]
        
        for post_data in sample_blog_posts:
            post = BlogPost(**post_data)
            await db.blog_posts.insert_one(post.dict())
    
    # Initialize default settings if not exist
    existing_settings = await db.site_settings.count_documents({})
    if existing_settings == 0:
        default_settings = SiteSettings(
            phone="+7 (495) 123-45-67",
            email="info@psychocenter.ru",
            address="Москва, ул. Примерная, д. 10",
            work_schedule="Пн-Пт: 9:00 - 20:00, Сб-Вс: 10:00 - 18:00",
            vk_link="https://vk.com/psychocenter",
            privacy_policy="<h1>Политика конфиденциальности</h1><p>Здесь будет политика конфиденциальности...</p>"
        )
        await db.site_settings.insert_one(default_settings.dict())

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()