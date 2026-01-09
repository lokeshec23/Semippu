from pydantic import BaseModel, Field, BeforeValidator
from typing import Optional, Annotated
from datetime import datetime

PyObjectId = Annotated[str, BeforeValidator(str)]

class BankAccountBase(BaseModel):
    user_id: PyObjectId = Field(..., alias="userId")
    bank_name: str = Field(..., alias="bankName")
    account_number: str = Field(..., alias="accountNumber") # Should be encrypted in real app
    ifsc_code: str = Field(..., min_length=11, max_length=11, alias="ifscCode")
    account_type: str = Field(..., alias="accountType") # Savings/Current
    branch_name: Optional[str] = Field(None, alias="branchName")
    upi_id: Optional[str] = Field(None, alias="upiId")
    is_primary: bool = Field(True, alias="isPrimary")
    balance: float = 0.0

class BankAccountCreate(BankAccountBase):
    pass

class BankAccountUpdate(BaseModel):
    bank_name: Optional[str] = Field(None, alias="bankName")
    account_number: Optional[str] = Field(None, alias="accountNumber")
    ifsc_code: Optional[str] = Field(None, alias="ifscCode")
    account_type: Optional[str] = Field(None, alias="accountType")
    branch_name: Optional[str] = Field(None, alias="branchName")
    upi_id: Optional[str] = Field(None, alias="upiId")
    is_primary: Optional[bool] = Field(None, alias="isPrimary")
    balance: Optional[float] = None

class BankAccountInDB(BankAccountBase):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
