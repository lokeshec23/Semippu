from fastapi import APIRouter, Body, HTTPException, status
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from app.models.user import UserCreate, UserLogin, UserUpdate, UserInDB
from app.database import user_collection
from datetime import datetime
from bson import ObjectId
import hashlib

router = APIRouter()

def hash_password(password: str) -> str:
    """Hash password using SHA256"""
    return hashlib.sha256(password.encode()).hexdigest()

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify password against hash"""
    return hash_password(plain_password) == hashed_password

@router.post("/auth/register", response_description="Register new user", response_model=UserInDB)
async def register_user(user: UserCreate = Body(...)):
    # Check if email already exists
    if await user_collection.find_one({"email": user.email}):
        raise HTTPException(status_code=400, detail="Email already registered")
    
    user_dict = jsonable_encoder(user)
    user_dict["password"] = hash_password(user.password)
    user_dict["created_at"] = datetime.utcnow()
    user_dict["updated_at"] = datetime.utcnow()
    user_dict["onboarding_completed"] = False
    
    new_user = await user_collection.insert_one(user_dict)
    created_user = await user_collection.find_one({"_id": new_user.inserted_id})
    return created_user

@router.post("/auth/login", response_description="Login user", response_model=UserInDB)
async def login_user(credentials: UserLogin = Body(...)):
    user = await user_collection.find_one({"email": credentials.email})
    
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    if not verify_password(credentials.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    return user

@router.get("/user/{id}", response_description="Get a single user", response_model=UserInDB)
async def get_user(id: str):
    if (user := await user_collection.find_one({"_id": ObjectId(id)})) is not None:
        return user
    raise HTTPException(status_code=404, detail=f"User {id} not found")

@router.put("/user/{id}", response_description="Update user profile", response_model=UserInDB)
async def update_user(id: str, user: UserUpdate = Body(...)):
    # Filter out None values
    user_data = {k: v for k, v in user.dict(exclude_unset=True).items() if v is not None}
    
    if len(user_data) >= 1:
        user_data["updated_at"] = datetime.utcnow()
        update_result = await user_collection.update_one(
            {"_id": ObjectId(id)}, {"$set": user_data}
        )
        if update_result.modified_count == 1:
            if (updated_user := await user_collection.find_one({"_id": ObjectId(id)})) is not None:
                return updated_user
                
    if (existing_user := await user_collection.find_one({"_id": ObjectId(id)})) is not None:
        return existing_user
        
    raise HTTPException(status_code=404, detail=f"User {id} not found")
