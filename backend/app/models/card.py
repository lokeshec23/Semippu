from pydantic import BaseModel, Field, BeforeValidator
from typing import Optional, Annotated
from datetime import datetime

PyObjectId = Annotated[str, BeforeValidator(str)]

class CardBase(BaseModel):
    user_id: PyObjectId = Field(..., alias="userId")
    card_type: str = Field(..., alias="cardType") # credit/debit
    
    # Common
    card_number: str = Field(..., alias="cardNumber") # Storing last 4 digits ideally or masked
    card_holder_name: str = Field(..., alias="cardHolderName")
    bank_name: str = Field(..., alias="bankName")
    expiry_date: str = Field(..., alias="expiryDate") # MM/YY
    card_provider: str = Field(..., alias="cardProvider") # Visa/Mastercard
    
    # Credit Specific
    card_name: Optional[str] = Field(None, alias="cardName")
    credit_limit: Optional[float] = Field(None, alias="creditLimit")
    current_outstanding: Optional[float] = Field(0, alias="currentOutstanding")
    billing_date: Optional[int] = Field(None, alias="billingDate")
    due_date: Optional[int] = Field(None, alias="dueDate")
    min_due_percentage: Optional[float] = Field(5.0, alias="minDuePercentage")
    interest_rate: Optional[float] = Field(None, alias="interestRate")
    joining_fee: Optional[float] = Field(None, alias="joiningFee")
    annual_fee: Optional[float] = Field(None, alias="annualFee")
    reward_program: Optional[str] = Field(None, alias="rewardProgram")
    benefits: Optional[str] = Field(None, alias="benefits")
    card_status: str = Field("Active", alias="cardStatus")
    
    # Debit Specific
    daily_limit: Optional[float] = Field(None, alias="dailyLimit")
    linked_account_id: Optional[PyObjectId] = Field(None, alias="linkedAccountId")

class CardCreate(CardBase):
    pass

class CardUpdate(BaseModel):
    card_name: Optional[str] = Field(None, alias="cardName")
    current_outstanding: Optional[float] = Field(None, alias="currentOutstanding")
    card_status: Optional[str] = Field(None, alias="cardStatus")
    # Add other fields as needed

class CardInDB(CardBase):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    is_active: bool = Field(True, alias="isActive")

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {datetime: lambda v: v.isoformat()}
        by_alias = True  # Serialize using alias names (camelCase)
