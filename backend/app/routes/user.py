from fastapi import APIRouter, Body, HTTPException, status, Depends
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from app.models.user import UserCreate, UserLogin, UserUpdate, UserInDB, TokenResponse, TokenRefresh
from app.database import user_collection
from app.utils.auth import (
    hash_password, 
    verify_password, 
    create_access_token, 
    create_refresh_token,
    verify_token,
    get_current_user
)
from datetime import datetime
from bson import ObjectId

router = APIRouter()

@router.post("/auth/register", response_description="Register new user", response_model=TokenResponse)
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
    
    # Generate tokens
    user_id = str(created_user["_id"])
    access_token = create_access_token(data={"sub": user_id})
    refresh_token = create_refresh_token(data={"sub": user_id})
    
    # Store refresh token in database
    await user_collection.update_one(
        {"_id": ObjectId(user_id)},
        {"$set": {"refresh_token": refresh_token}}
    )
    
    # Remove password from response
    created_user.pop("password", None)
    created_user.pop("refresh_token", None)
    
    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        user=created_user
    )

@router.post("/auth/login", response_description="Login user", response_model=TokenResponse)
async def login_user(credentials: UserLogin = Body(...)):
    user = await user_collection.find_one({"email": credentials.email})
    
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    if not verify_password(credentials.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    # Generate tokens
    user_id = str(user["_id"])
    access_token = create_access_token(data={"sub": user_id})
    refresh_token = create_refresh_token(data={"sub": user_id})
    
    # Store refresh token in database
    await user_collection.update_one(
        {"_id": ObjectId(user_id)},
        {"$set": {"refresh_token": refresh_token, "updated_at": datetime.utcnow()}}
    )
    
    # Remove password from response
    user.pop("password", None)
    user.pop("refresh_token", None)
    
    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        user=user
    )

@router.post("/auth/refresh", response_description="Refresh access token")
async def refresh_access_token(token_data: TokenRefresh = Body(...)):
    # Verify refresh token
    payload = verify_token(token_data.refresh_token, "refresh")
    user_id = payload.get("sub")
    
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid refresh token")
    
    # Verify token exists in database
    user = await user_collection.find_one({"_id": ObjectId(user_id)})
    if not user or user.get("refresh_token") != token_data.refresh_token:
        raise HTTPException(status_code=401, detail="Invalid refresh token")
    
    # Generate new access token
    access_token = create_access_token(data={"sub": user_id})
    
    return {
        "access_token": access_token,
        "token_type": "bearer"
    }

@router.post("/auth/logout", response_description="Logout user")
async def logout_user(current_user: dict = Depends(get_current_user)):
    # Invalidate refresh token
    await user_collection.update_one(
        {"_id": current_user["_id"]},
        {"$set": {"refresh_token": None, "updated_at": datetime.utcnow()}}
    )
    return {"message": "Successfully logged out"}

@router.get("/user/{id}", response_description="Get a single user", response_model=UserInDB)
async def get_user(id: str, current_user: dict = Depends(get_current_user)):
    # Users can only access their own data
    if str(current_user["_id"]) != id:
        raise HTTPException(status_code=403, detail="Access forbidden")
    
    if (user := await user_collection.find_one({"_id": ObjectId(id)})) is not None:
        return user
    raise HTTPException(status_code=404, detail=f"User {id} not found")

@router.put("/user/{id}", response_description="Update user profile", response_model=UserInDB)
async def update_user(id: str, user: UserUpdate = Body(...), current_user: dict = Depends(get_current_user)):
    # Users can only update their own data
    if str(current_user["_id"]) != id:
        raise HTTPException(status_code=403, detail="Access forbidden")
    
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

