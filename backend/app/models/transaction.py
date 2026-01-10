from pydantic import BaseModel, Field, BeforeValidator
from typing import Optional, Annotated, List
from datetime import datetime

PyObjectId = Annotated[str, BeforeValidator(str)]

class TransactionBase(BaseModel):
    user_id: PyObjectId = Field(..., alias="userId")
    card_id: Optional[PyObjectId] = Field(None, alias="cardId") # Link to card
    date: datetime = Field(default_factory=datetime.now)
    merchant: str = Field(...)
    description: Optional[str] = None
    amount: float = Field(..., gt=0)
    category: str = Field(...)
    payment_mode: str = Field(..., alias="paymentMode") # Credit Card, Debit Card, UPI, etc.
    is_emi: bool = Field(False, alias="isEMI")
    tags: List[str] = []
    notes: Optional[str] = None

class TransactionCreate(TransactionBase):
    pass

class TransactionUpdate(BaseModel):
    merchant: Optional[str] = None
    amount: Optional[float] = None
    category: Optional[str] = None
    date: Optional[datetime] = None
    notes: Optional[str] = None
    tags: Optional[List[str]] = None

class TransactionInDB(TransactionBase):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
