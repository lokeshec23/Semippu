from fastapi import APIRouter, Body, HTTPException, status
from fastapi.encoders import jsonable_encoder
from typing import List
from app.models.card import CardCreate, CardUpdate, CardInDB
from app.database import card_collection
from datetime import datetime
from bson import ObjectId

router = APIRouter()

@router.post("/cards", response_description="Add new card", response_model=CardInDB)
async def create_card(card: CardCreate = Body(...)):
    card = jsonable_encoder(card)
    card["created_at"] = datetime.utcnow()
    card["isActive"] = True
    
    new_card = await card_collection.insert_one(card)
    created_card = await card_collection.find_one({"_id": new_card.inserted_id})
    return created_card

@router.get("/cards/{user_id}", response_description="List all cards for a user", response_model=List[CardInDB])
async def list_cards(user_id: str):
    cards = await card_collection.find({"userId": user_id}).to_list(100)
    return cards

@router.get("/cards/detail/{card_id}", response_description="Get single card", response_model=CardInDB)
async def get_card(card_id: str):
    if (card := await card_collection.find_one({"_id": ObjectId(card_id)})) is not None:
        return card
    raise HTTPException(status_code=404, detail=f"Card {card_id} not found")
