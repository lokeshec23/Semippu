from fastapi import APIRouter, Body, HTTPException, status
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from app.models.user import UserCreate, UserUpdate, UserInDB
from app.database import user_collection
from datetime import datetime
from bson import ObjectId

router = APIRouter()

@router.post("/auth/register", response_description="Register new user", response_model=UserInDB)
async def register_user(user: UserCreate = Body(...)):
    user = jsonable_encoder(user)
    
    # Check if email or phone already exists
    if await user_collection.find_one({"personal_info.email": user["personal_info"]["email"]}):
        raise HTTPException(status_code=400, detail="Email already registered")
        
    user["created_at"] = datetime.utcnow()
    user["updated_at"] = datetime.utcnow()
    
    new_user = await user_collection.insert_one(user)
    created_user = await user_collection.find_one({"_id": new_user.inserted_id})
    return created_user

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
