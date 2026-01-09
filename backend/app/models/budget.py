from pydantic import BaseModel, Field, BeforeValidator
from typing import Optional, Annotated, Dict
from datetime import datetime

PyObjectId = Annotated[str, BeforeValidator(str)]

class BudgetBase(BaseModel):
    user_id: PyObjectId = Field(..., alias="userId")
    month_year: str = Field(..., alias="monthYear") # Format: "MM-YYYY"
    total_budget: float = Field(..., alias="totalBudget")
    categories: Dict[str, float] = Field(default_factory=dict)
    savings_goal: Optional[float] = Field(0, alias="savingsGoal")

class BudgetCreate(BudgetBase):
    pass

class BudgetInDB(BudgetBase):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
