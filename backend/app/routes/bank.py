from fastapi import APIRouter, Body, HTTPException, status
from fastapi.encoders import jsonable_encoder
from typing import List
from app.models.bank import BankAccountCreate, BankAccountUpdate, BankAccountInDB
from app.database import bank_collection
from datetime import datetime
from bson import ObjectId

router = APIRouter()

@router.post("/bank-accounts", response_description="Add new bank account", response_model=BankAccountInDB)
async def create_bank_account(account: BankAccountCreate = Body(...)):
    account = jsonable_encoder(account)
    account["created_at"] = datetime.utcnow()
    account["updated_at"] = datetime.utcnow()
    
    new_account = await bank_collection.insert_one(account)
    created_account = await bank_collection.find_one({"_id": new_account.inserted_id})
    return created_account

@router.get("/bank-accounts/{user_id}", response_description="List all bank accounts for a user", response_model=List[BankAccountInDB])
async def list_bank_accounts(user_id: str):
    accounts = await bank_collection.find({"userId": user_id}).to_list(100)
    return accounts

@router.delete("/bank-accounts/{id}", response_description="Delete a bank account")
async def delete_bank_account(id: str):
    delete_result = await bank_collection.delete_one({"_id": ObjectId(id)})
    if delete_result.deleted_count == 1:
        return {"message": "Bank account deleted"}
    raise HTTPException(status_code=404, detail=f"Bank account {id} not found")
