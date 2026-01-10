from fastapi import APIRouter, Body, HTTPException, status
from fastapi.encoders import jsonable_encoder
from typing import List
from app.models.transaction import TransactionCreate, TransactionUpdate, TransactionInDB
from app.database import transaction_collection, card_collection
from datetime import datetime
from bson import ObjectId

router = APIRouter()

@router.post("/transactions", response_description="Add new transaction", response_model=TransactionInDB)
async def create_transaction(transaction: TransactionCreate = Body(...)):
    transaction = jsonable_encoder(transaction)
    transaction["created_at"] = datetime.utcnow()
    transaction["updated_at"] = datetime.utcnow()
    
    new_transaction = await transaction_collection.insert_one(transaction)
    created_transaction = await transaction_collection.find_one({"_id": new_transaction.inserted_id})
    
    # Update Card outstanding if linked to a card
    if transaction.get("cardId") and transaction.get("paymentMode") == "Credit Card":
        await card_collection.update_one(
            {"_id": ObjectId(transaction["cardId"])},
            {"$inc": {"currentOutstanding": transaction["amount"]}}
        )

    return created_transaction

@router.get("/transactions/card/{card_id}", response_description="Get transactions for a card", response_model=List[TransactionInDB])
async def list_transactions_by_card(card_id: str):
    transactions = await transaction_collection.find({"cardId": card_id}).sort("date", -1).to_list(100)
    return transactions

@router.get("/transactions/user/{user_id}", response_description="Get all user transactions", response_model=List[TransactionInDB])
async def list_transactions_by_user(user_id: str):
    transactions = await transaction_collection.find({"userId": user_id}).sort("date", -1).to_list(100)
    return transactions

@router.delete("/transactions/{id}", response_description="Delete a transaction")
async def delete_transaction(id: str):
    # Fetch transaction first to reverse card balance impact if needed
    transaction = await transaction_collection.find_one({"_id": ObjectId(id)})
    if not transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")

    delete_result = await transaction_collection.delete_one({"_id": ObjectId(id)})
    
    if delete_result.deleted_count == 1:
        # Reverse balance update if it was a credit card expense
        if transaction.get("cardId") and transaction.get("paymentMode") == "Credit Card":
             await card_collection.update_one(
                {"_id": ObjectId(transaction["cardId"])},
                {"$inc": {"currentOutstanding": -transaction["amount"]}}
            )
        return {"message": "Transaction deleted"}
    
    raise HTTPException(status_code=404, detail="Transaction not found")
