from sqlalchemy import Column, Integer, String, Text, DateTime
from sqlalchemy.sql import func

from .database import Base


class Lead(Base):
    __tablename__ = "leads"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String(100), nullable=False)
    company = Column(String(150), nullable=False)
    email = Column(String(150), nullable=False)
    event = Column(String(150), nullable=False)

    notes = Column(Text, nullable=True)

    follow_up_status = Column(
        String(50),
        nullable=False,
        default="Pending"
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now()
    )