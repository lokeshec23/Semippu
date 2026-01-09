from fastapi import APIRouter, Body, HTTPException, status
from fastapi.encoders import jsonable_encoder
from app.models.budget import BudgetCreate, BudgetInDB
from app.database import budget_collection
from datetime import datetime
from bson import ObjectId

router = APIRouter()

@router.post("/budgets", response_description="Set monthly budget", response_model=BudgetInDB)
async def create_budget(budget: BudgetCreate = Body(...)):
    budget = jsonable_encoder(budget)
    budget["created_at"] = datetime.utcnow()
    budget["updated_at"] = datetime.utcnow()
    
    # Check if budget for this month exists, if so update/replace
    existing = await budget_collection.find_one({
        "userId": budget["userId"],
        "monthYear": budget["monthYear"]
    })
    
    if existing:
        updated_budget = await budget_collection.find_one_and_update(
            {"_id": existing["_id"]},
            {"$set": budget},
            return_document=True
        )
        return updated_budget

    new_budget = await budget_collection.insert_one(budget)
    created_budget = await budget_collection.find_one({"_id": new_budget.inserted_id})
    return created_budget

@router.get("/budgets/{user_id}/{month_year}", response_description="Get budget", response_model=BudgetInDB)
async def get_budget(user_id: str, month_year: str):
    if (budget := await budget_collection.find_one({"userId": user_id, "monthYear": month_year})) is not None:
        return budget
    raise HTTPException(status_code=404, detail="Budget not found")
