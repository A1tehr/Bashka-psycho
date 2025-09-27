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
