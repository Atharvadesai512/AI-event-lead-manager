from datetime import datetime

from pydantic import BaseModel, EmailStr, ConfigDict


class LeadBase(BaseModel):
    name: str
    company: str
    email: EmailStr
    event: str
    notes: str | None = None
    follow_up_status: str = "Pending"


class LeadCreate(LeadBase):
    pass


class LeadUpdate(BaseModel):
    name: str | None = None
    company: str | None = None
    email: EmailStr | None = None
    event: str | None = None
    notes: str | None = None
    follow_up_status: str | None = None


class LeadResponse(LeadBase):
    id: int
    created_at: datetime | None = None
    updated_at: datetime | None = None

    model_config = ConfigDict(from_attributes=True)