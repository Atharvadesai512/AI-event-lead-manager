from sqlalchemy.orm import Session

from . import models
from . import schemas


def create_lead(db: Session, lead: schemas.LeadCreate):
    db_lead = models.Lead(
        name=lead.name,
        company=lead.company,
        email=lead.email,
        event=lead.event,
        notes=lead.notes,
        follow_up_status=lead.follow_up_status,
    )

    db.add(db_lead)
    db.commit()
    db.refresh(db_lead)

    return db_lead


def get_leads(
    db: Session,
    search: str | None = None,
    event: str | None = None,
    follow_up_status: str | None = None,
):
    query = db.query(models.Lead)

    if search:
        search_term = f"%{search}%"

        query = query.filter(
            (models.Lead.name.ilike(search_term))
            | (models.Lead.company.ilike(search_term))
            | (models.Lead.email.ilike(search_term))
            | (models.Lead.event.ilike(search_term))
        )

    if event:
        query = query.filter(models.Lead.event == event)

    if follow_up_status:
        query = query.filter(
            models.Lead.follow_up_status == follow_up_status
        )

    return query.order_by(models.Lead.created_at.desc()).all()


def get_lead(db: Session, lead_id: int):
    return (
        db.query(models.Lead)
        .filter(models.Lead.id == lead_id)
        .first()
    )


def update_lead(
    db: Session,
    lead_id: int,
    lead_data: schemas.LeadUpdate,
):
    db_lead = get_lead(db, lead_id)

    if not db_lead:
        return None

    update_data = lead_data.model_dump(exclude_unset=True)

    for field, value in update_data.items():
        setattr(db_lead, field, value)

    db.commit()
    db.refresh(db_lead)

    return db_lead


def delete_lead(db: Session, lead_id: int):
    db_lead = get_lead(db, lead_id)

    if not db_lead:
        return None

    db.delete(db_lead)
    db.commit()

    return db_lead