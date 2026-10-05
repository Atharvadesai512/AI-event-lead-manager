from fastapi import Depends, FastAPI, HTTPException, Query
from sqlalchemy.orm import Session
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from . import crud
from . import schemas
from .database import Base, engine, get_db
from .ai_service import generate_follow_up

Base.metadata.create_all(bind=engine)


app = FastAPI(
    title="AI Event Lead Manager",
    description="AI-powered event lead management system",
    version="1.0.0",
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {
        "message": "AI Event Lead Manager API is running"
    }


@app.post(
    "/leads/",
    response_model=schemas.LeadResponse,
    status_code=201,
)
def create_lead(
    lead: schemas.LeadCreate,
    db: Session = Depends(get_db),
):
    return crud.create_lead(db, lead)


@app.get(
    "/leads/",
    response_model=list[schemas.LeadResponse],
)
def get_leads(
    search: str | None = Query(
        default=None,
        description="Search by name, company, email, or event",
    ),
    event: str | None = Query(
        default=None,
        description="Filter by event",
    ),
    follow_up_status: str | None = Query(
        default=None,
        description="Filter by follow-up status",
    ),
    db: Session = Depends(get_db),
):
    return crud.get_leads(
        db=db,
        search=search,
        event=event,
        follow_up_status=follow_up_status,
    )


@app.get(
    "/leads/{lead_id}",
    response_model=schemas.LeadResponse,
)
def get_lead(
    lead_id: int,
    db: Session = Depends(get_db),
):
    lead = crud.get_lead(db, lead_id)

    if not lead:
        raise HTTPException(
            status_code=404,
            detail="Lead not found",
        )

    return lead


@app.put(
    "/leads/{lead_id}",
    response_model=schemas.LeadResponse,
)
def update_lead(
    lead_id: int,
    lead_data: schemas.LeadUpdate,
    db: Session = Depends(get_db),
):
    lead = crud.update_lead(
        db,
        lead_id,
        lead_data,
    )

    if not lead:
        raise HTTPException(
            status_code=404,
            detail="Lead not found",
        )

    return lead


@app.delete(
    "/leads/{lead_id}",
)
def delete_lead(
    lead_id: int,
    db: Session = Depends(get_db),
):
    lead = crud.delete_lead(db, lead_id)

    if not lead:
        raise HTTPException(
            status_code=404,
            detail="Lead not found",
        )

    return {
        "message": "Lead deleted successfully",
        "lead_id": lead_id,
    }

@app.post("/leads/{lead_id}/ai-draft")
def generate_ai_draft(
    lead_id: int,
    db: Session = Depends(get_db),
):
    lead = crud.get_lead(db, lead_id)

    if not lead:
        raise HTTPException(
            status_code=404,
            detail="Lead not found",
        )

    if not lead.notes:
        raise HTTPException(
            status_code=400,
            detail="Lead does not have interaction notes",
        )

    try:
        draft = generate_follow_up(
            name=lead.name,
            company=lead.company,
            event=lead.event,
            notes=lead.notes,
        )
    except Exception as exc:
        raise HTTPException(
            status_code=503,
            detail="AI follow-up generation is temporarily unavailable. Please try again later.",
        ) from exc

    return {
        "lead_id": lead.id,
        "follow_up_message": draft,
    }