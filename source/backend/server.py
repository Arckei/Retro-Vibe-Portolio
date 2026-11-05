from fastapi import FastAPI, APIRouter
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List
import uuid
from datetime import datetime, timezone

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ.get('MONGO_URL', '')
db_name = os.environ.get('DB_NAME', 'retro_portfolio')

client = None
db = None
if mongo_url:
    try:
        client = AsyncIOMotorClient(mongo_url)
        db = client[db_name]
        logger.info("MongoDB client initialized successfully.")
    except Exception as e:
        logger.error("Failed to initialize MongoDB client: %s", e)
else:
    logger.warning("MONGO_URL not set. Running without active MongoDB connection.")

app = FastAPI()
api_router = APIRouter(prefix="/api")


class ContactMessage(BaseModel):
    model_config = ConfigDict(extra="ignore")

    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: EmailStr
    message: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class ContactMessageCreate(BaseModel):
    name: str
    email: EmailStr
    message: str


@api_router.get("/")
@app.get("/")
async def root():
    return {
        "message": "retro-portfolio api online",
        "database": "connected" if db is not None else "not configured"
    }


@api_router.post("/contact", response_model=ContactMessage)
@app.post("/contact", response_model=ContactMessage)
async def create_contact_message(input: ContactMessageCreate):
    msg = ContactMessage(**input.model_dump())
    if db is not None:
        try:
            doc = msg.model_dump()
            doc['timestamp'] = doc['timestamp'].isoformat()
            await db.contact_messages.insert_one(doc)
        except Exception as e:
            logger.error("Error saving message to database: %s", e)
    else:
        logger.info("Message received (DB disabled): %s", msg.model_dump())
    return msg


@api_router.get("/contact", response_model=List[ContactMessage])
@app.get("/contact", response_model=List[ContactMessage])
async def get_contact_messages():
    if db is not None:
        try:
            messages = await db.contact_messages.find({}, {"_id": 0}).to_list(1000)
            for m in messages:
                if isinstance(m['timestamp'], str):
                    m['timestamp'] = datetime.fromisoformat(m['timestamp'])
            return messages
        except Exception as e:
            logger.error("Error fetching messages from database: %s", e)
            return []
    return []


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("shutdown")
async def shutdown_db_client():
    if client:
        client.close()
