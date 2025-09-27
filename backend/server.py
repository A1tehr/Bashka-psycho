from fastapi import FastAPI, APIRouter, HTTPException
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
    version="1.0.0"
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

# Routes
@api_router.get("/")
async def root():
    return {"message": "Psychology Center Development API"}

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

@api_router.post("/programs", response_model=Program)
async def create_program(program_data: ProgramCreate):
    program = Program(**program_data.dict())
    await db.programs.insert_one(program.dict())
    return program

# Appointments endpoints
@api_router.get("/appointments", response_model=List[Appointment])
async def get_appointments():
    appointments = await db.appointments.find().to_list(1000)
    return [Appointment(**appointment) for appointment in appointments]

@api_router.post("/appointments", response_model=Appointment)
async def create_appointment(appointment_data: AppointmentCreate):
    # Check if program exists
    program = await db.programs.find_one({"id": appointment_data.program_id})
    if not program:
        raise HTTPException(status_code=404, detail="Program not found")
    
    appointment = Appointment(**appointment_data.dict())
    await db.appointments.insert_one(appointment.dict())
    return appointment

@api_router.put("/appointments/{appointment_id}/status")
async def update_appointment_status(appointment_id: str, status: AppointmentStatus):
    result = await db.appointments.update_one(
        {"id": appointment_id},
        {"$set": {"status": status}}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Appointment not found")
    return {"message": "Status updated successfully"}

# Contact form endpoints
@api_router.get("/contacts", response_model=List[Contact])
async def get_contacts():
    contacts = await db.contacts.find().to_list(1000)
    return [Contact(**contact) for contact in contacts]

@api_router.post("/contacts", response_model=Contact)
async def create_contact(contact_data: ContactCreate):
    contact = Contact(**contact_data.dict())
    await db.contacts.insert_one(contact.dict())
    return contact

# Newsletter endpoints
@api_router.get("/newsletter", response_model=List[Newsletter])
async def get_newsletter_subscriptions():
    subscriptions = await db.newsletter.find().to_list(1000)
    return [Newsletter(**subscription) for subscription in subscriptions]

@api_router.post("/newsletter", response_model=Newsletter)
async def subscribe_newsletter(subscription_data: NewsletterCreate):
    # Check if email already exists
    existing = await db.newsletter.find_one({"email": subscription_data.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already subscribed")
    
    subscription = Newsletter(**subscription_data.dict())
    await db.newsletter.insert_one(subscription.dict())
    return subscription

# Blog endpoints
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

@api_router.post("/blog", response_model=BlogPost)
async def create_blog_post(post_data: BlogPostCreate):
    # Check if slug already exists
    existing = await db.blog_posts.find_one({"slug": post_data.slug})
    if existing:
        raise HTTPException(status_code=400, detail="Slug already exists")
    
    post = BlogPost(**post_data.dict())
    await db.blog_posts.insert_one(post.dict())
    return post

# Initialize default programs
@app.on_event("startup")
async def initialize_programs():
    # Check if programs already exist
    existing_programs = await db.programs.count_documents({})
    if existing_programs > 0:
        return
    
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
            "image_url": "https://images.unsplash.com/photo-1600880291319-1a7499c191e8?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzZ8MHwxfHNlYXJjaHwzfHxjaGlsZHJlbiUyMGRldmVsb3BtZW50fGVufDB8fHx8MTc1ODk3NjUwOHww&ixlib=rb-4.1.0&q=85"
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
            "image_url": "https://images.pexels.com/photos/34056489/pexels-photo-34056489.jpeg"
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
            "image_url": "https://images.pexels.com/photos/7579302/pexels-photo-7579302.jpeg"
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
            "image_url": "https://images.pexels.com/photos/7579304/pexels-photo-7579304.jpeg"
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
            "image_url": "https://images.pexels.com/photos/34004605/pexels-photo-34004605.jpeg"
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
            "image_url": "https://images.unsplash.com/photo-1648143714234-810e3ce38cc6?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzZ8MHwxfHNlYXJjaHwxfHxjaGlsZHJlbiUyMGRldmVsb3BtZW50fGVufDB8fHx8MTc1ODk3NjUwOHww&ixlib=rb-4.1.0&q=85"
        }
    ]
    
    # Insert default programs
    for program_data in default_programs:
        program = Program(**program_data)
        await db.programs.insert_one(program.dict())
    
    # Initialize some sample blog posts
    sample_blog_posts = [
        {
            "title": "Как подготовить ребенка к школе: психологические аспекты",
            "slug": "kak-podgotovit-rebenka-k-shkole",
            "excerpt": "Психологическая готовность к школе не менее важна, чем умение читать и считать. Рассказываем, на что обратить внимание.",
            "content": "Подготовка к школе — это не только обучение чтению и счету...",
            "author": "Детский психолог центра",
            "tags": ["дошкольная подготовка", "психология", "развитие детей"],
            "image_url": "https://images.unsplash.com/photo-1600880291319-1a7499c191e8?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzZ8MHwxfHNlYXJjaHwzfHxjaGlsZHJlbiUyMGRldmVsb3BtZW50fGVufDB8fHx8MTc1ODk3NjUwOHww&ixlib=rb-4.1.0&q=85",
            "published": True
        },
        {
            "title": "Эмоциональный интеллект у детей: как развивать",
            "slug": "emotsionalnyy-intellekt-u-detey",
            "excerpt": "Эмоциональный интеллект играет ключевую роль в успешности ребенка. Узнайте, как его развивать.",
            "content": "Эмоциональный интеллект — это способность понимать и управлять своими эмоциями...",
            "author": "Семейный психолог",
            "tags": ["эмоциональный интеллект", "воспитание", "психология детей"],
            "image_url": "https://images.pexels.com/photos/34056489/pexels-photo-34056489.jpeg",
            "published": True
        },
        {
            "title": "Тайм-менеджмент для подростков: с чего начать",
            "slug": "taym-menedzhment-dlya-podrostkov",
            "excerpt": "Научите подростка управлять своим временем — это поможет ему в учебе и жизни.",
            "content": "Подростковый возраст — время больших изменений и новых задач...",
            "author": "Психолог-консультант",
            "tags": ["тайм-менеджмент", "подростки", "планирование"],
            "image_url": "https://images.unsplash.com/photo-1648143714234-810e3ce38cc6?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzZ8MHwxfHNlYXJjaHwxfHxjaGlsZHJlbiUyMGRldmVsb3BtZW50fGVufDB8fHx8MTc1ODk3NjUwOHww&ixlib=rb-4.1.0&q=85",
            "published": True
        }
    ]
    
    for post_data in sample_blog_posts:
        post = BlogPost(**post_data)
        await db.blog_posts.insert_one(post.dict())

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
