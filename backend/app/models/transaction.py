from pydantic import BaseModel, Field, BeforeValidator
from typing import Optional, Annotated
from datetime import datetime

PyObjectId = Annotated[str, BeforeValidator(str)]

class TransactionBase(BaseModel):
    user_id: PyObjectId = Field(..., alias="userId")
    transaction_type: str = Field(..., alias="transactionType")  # income/expense
    amount: float = Field(..., gt=0)
    category: str
    merchant: Optional[str] = None
    description: Optional[str] = None
    date: datetime
    card_id: Optional[PyObjectId] = Field(None, alias="cardId")
    bank_account_id: Optional[PyObjectId] = Field(None, alias="bankAccountId")
    payment_method: str = Field(..., alias="paymentMethod")  # cash/card/upi/bank_transfer
    status: str = Field(default="completed")  # completed/pending/failed

class TransactionCreate(TransactionBase):
    pass

class TransactionUpdate(BaseModel):
    amount: Optional[float] = Field(None, gt=0)
    category: Optional[str] = None
    merchant: Optional[str] = None
    description: Optional[str] = None
    date: Optional[datetime] = None
    status: Optional[str] = None

class TransactionInDB(TransactionBase):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
