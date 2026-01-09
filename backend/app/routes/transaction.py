from fastapi import APIRouter, Body, HTTPException, status, Query
from fastapi.encoders import jsonable_encoder
from app.models.transaction import TransactionCreate, TransactionUpdate, TransactionInDB
from app.database import transaction_collection
from datetime import datetime
from bson import ObjectId
from typing import List, Optional

router = APIRouter()

@router.post("/transactions", response_description="Add new transaction", response_model=TransactionInDB)
async def create_transaction(transaction: TransactionCreate = Body(...)):
    transaction_dict = jsonable_encoder(transaction)
    transaction_dict["created_at"] = datetime.utcnow()
    
    new_transaction = await transaction_collection.insert_one(transaction_dict)
    created_transaction = await transaction_collection.find_one({"_id": new_transaction.inserted_id})
    return created_transaction

@router.get("/transactions/{user_id}", response_description="Get all user transactions", response_model=List[TransactionInDB])
async def get_user_transactions(
    user_id: str,
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    category: Optional[str] = None,
    transaction_type: Optional[str] = None,
    start_date: Optional[str] = None,
    end_date: Optional[str] = None
):
    query = {"userId": user_id}  # Changed from user_id to userId
    
    # Add filters if provided
    if category:
        query["category"] = category
    if transaction_type:
        query["transactionType"] = transaction_type  # Changed to camelCase
    if start_date:
        query["date"] = {"$gte": datetime.fromisoformat(start_date)}
    if end_date:
        if "date" in query:
            query["date"]["$lte"] = datetime.fromisoformat(end_date)
        else:
            query["date"] = {"$lte": datetime.fromisoformat(end_date)}
    
    transactions = await transaction_collection.find(query).sort("date", -1).skip(skip).limit(limit).to_list(limit)
    return transactions

@router.get("/transactions/{user_id}/recent", response_description="Get recent transactions", response_model=List[TransactionInDB])
async def get_recent_transactions(user_id: str, limit: int = Query(10, ge=1, le=50)):
    transactions = await transaction_collection.find({"userId": user_id}).sort("date", -1).limit(limit).to_list(limit)  # Changed from user_id to userId
    return transactions

@router.get("/transactions/card/{card_id}", response_description="Get card transactions", response_model=List[TransactionInDB])
async def get_card_transactions(card_id: str, limit: int = Query(100, ge=1, le=500)):
    transactions = await transaction_collection.find({"cardId": card_id}).sort("date", -1).limit(limit).to_list(limit)  # Changed from card_id to cardId
    return transactions

@router.get("/transactions/detail/{transaction_id}", response_description="Get single transaction", response_model=TransactionInDB)
async def get_transaction(transaction_id: str):
    if (transaction := await transaction_collection.find_one({"_id": ObjectId(transaction_id)})) is not None:
        return transaction
    raise HTTPException(status_code=404, detail=f"Transaction {transaction_id} not found")

@router.put("/transactions/{transaction_id}", response_description="Update transaction", response_model=TransactionInDB)
async def update_transaction(transaction_id: str, transaction: TransactionUpdate = Body(...)):
    transaction_data = {k: v for k, v in transaction.dict(exclude_unset=True).items() if v is not None}
    
    if len(transaction_data) >= 1:
        update_result = await transaction_collection.update_one(
            {"_id": ObjectId(transaction_id)}, {"$set": transaction_data}
        )
        if update_result.modified_count == 1:
            if (updated_transaction := await transaction_collection.find_one({"_id": ObjectId(transaction_id)})) is not None:
                return updated_transaction
                
    if (existing_transaction := await transaction_collection.find_one({"_id": ObjectId(transaction_id)})) is not None:
        return existing_transaction
        
    raise HTTPException(status_code=404, detail=f"Transaction {transaction_id} not found")

@router.delete("/transactions/{transaction_id}", response_description="Delete transaction")
async def delete_transaction(transaction_id: str):
    delete_result = await transaction_collection.delete_one({"_id": ObjectId(transaction_id)})
    
    if delete_result.deleted_count == 1:
        return {"message": "Transaction deleted successfully"}
        
    raise HTTPException(status_code=404, detail=f"Transaction {transaction_id} not found")
