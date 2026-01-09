from pydantic import BaseModel, EmailStr, Field, BeforeValidator
from typing import Optional, Annotated
from datetime import date, datetime

# Helper for ObjectId
PyObjectId = Annotated[str, BeforeValidator(str)]

class PersonalInfo(BaseModel):
    full_name: str = Field(..., min_length=3)
    phone_number: str = Field(..., pattern=r"^[0-9]{10}$")
    email: EmailStr

    profile_photo: Optional[str] = None # Base64 string

class EmploymentInfo(BaseModel):
    status: str # Employed/Self-Employed/Unemployed/Student
    company_name: Optional[str] = None
    designation: Optional[str] = None
    monthly_salary: float
    salary_date: Optional[int] = Field(None, ge=1, le=31)
    work_email: Optional[EmailStr] = None
    experience: Optional[float] = None
    industry: Optional[str] = None

class UserBase(BaseModel):
    personal_info: PersonalInfo
    employment_info: Optional[EmploymentInfo] = None
    onboarding_completed: bool = False

class UserCreate(UserBase):
    pass

class UserUpdate(BaseModel):
    personal_info: Optional[PersonalInfo] = None
    employment_info: Optional[EmploymentInfo] = None
    onboarding_completed: Optional[bool] = None

class UserInDB(UserBase):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
