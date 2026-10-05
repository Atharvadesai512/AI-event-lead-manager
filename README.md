# AI Event Lead Manager

A full-stack web application designed to help sales and business teams manage leads collected from events, track follow-ups, and generate personalized follow-up messages using AI.

This project was developed as a full-stack assignment using **React, FastAPI, SQLite, SQLAlchemy, Ollama, and Llama 3.2**.

---

## 🎯 Problem Statement

When companies participate in conferences, summits, exhibitions, and other business events, they often collect a large number of potential leads.

Managing these leads manually can create several problems:

* Lead information can become scattered across spreadsheets or notes.
* Sales teams may forget to follow up with leads.
* Searching for a specific lead can become difficult as the number of leads increases.
* Lead follow-up status may not be tracked consistently.
* Writing personalized follow-up messages for every lead takes additional time.

### Proposed Solution

The **AI Event Lead Manager** provides a centralized system where users can:

1. Store event lead information in a structured database.
2. Search and filter leads quickly.
3. Edit or delete lead information.
4. Track follow-up status.
5. Store interaction notes.
6. Generate personalized AI-assisted follow-up messages from those notes.

The goal is to reduce manual lead-management work and make post-event follow-up faster and more organized.

---

# 🚀 Features

## Lead Management

* Create new event leads
* View all leads
* Edit existing leads
* Delete leads
* Persistent database storage

## Search & Filtering

Search leads by:

* Name
* Company
* Email
* Event

Filter leads by:

* Event
* Follow-up status

## AI Follow-up Generation

The application can generate a personalized follow-up message based on:

* Lead name
* Company
* Event
* Interaction notes

The AI is instructed to:

* Keep the message concise
* Mention the event naturally
* Refer to the lead's actual interest
* Avoid inventing information
* Include a clear next step
* Avoid aggressive sales language

---

# 🛠️ Tech Stack

### Frontend

* React
* Vite
* Axios
* JavaScript
* CSS

### Backend

* Python
* FastAPI
* SQLAlchemy
* Pydantic
* SQLite

### AI

* Ollama
* Llama 3.2 (3B)

### Deployment

* Render
* GitHub

---

# 🏗️ Architecture

```text
┌─────────────────────────────┐
│        React Frontend       │
│          + Vite             │
└──────────────┬──────────────┘
               │
               │ REST API
               ▼
┌─────────────────────────────┐
│       FastAPI Backend       │
│                             │
│  CRUD + Search + Filtering  │
└──────────────┬──────────────┘
               │
       ┌───────┴────────┐
       ▼                ▼
┌─────────────┐  ┌─────────────────┐
│   SQLite    │  │ Ollama + Llama  │
│  Database   │  │      3.2        │
└─────────────┘  └─────────────────┘
```

---

# 📂 Project Structure

```text
AI-event-lead-manager/
│
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py
│   │   ├── database.py
│   │   ├── models.py
│   │   ├── schemas.py
│   │   ├── crud.py
│   │   └── ai_service.py
│   │
│   ├── requirements.txt
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   │
│   ├── package.json
│   └── ...
│
├── .gitignore
└── README.md
```

---

# 📋 Lead Data

Each lead contains:

| Field            | Description                       |
| ---------------- | --------------------------------- |
| Name             | Name of the lead                  |
| Company          | Lead's company                    |
| Email            | Contact email                     |
| Event            | Event where the lead was captured |
| Notes            | Interaction or conversation notes |
| Follow-up Status | Current follow-up status          |

The system also stores:

* Lead ID
* Created timestamp
* Updated timestamp

---

# 🔌 API Endpoints

Backend base URL:

```text
https://ai-event-lead-manager-1.onrender.com
```

### Create Lead

```http
POST /leads/
```

### Get Leads

```http
GET /leads/
```

Supports:

```text
?search=
?event=
?follow_up_status=
```

Example:

```text
GET /leads/?search=Rahul
```

### Get Single Lead

```http
GET /leads/{lead_id}
```

### Update Lead

```http
PUT /leads/{lead_id}
```

### Delete Lead

```http
DELETE /leads/{lead_id}
```

### Generate AI Follow-up

```http
POST /leads/{lead_id}/ai-draft
```

---

# 🤖 AI Implementation

The AI functionality uses:

```text
Ollama
   ↓
Llama 3.2:3b
```

The FastAPI backend sends the lead's information and interaction notes to the locally running Llama 3.2 model.

The model then generates a short, professional follow-up message.

### Example Input

```text
Lead: Rahul Sharma
Company: TechNova Solutions
Event: AI Summit Mumbai

Notes:
Interested in our AI automation solution.
Asked for a product demo next week.
```

### Example Output

```text
Hi Rahul,

It was great connecting with you at AI Summit Mumbai.
I wanted to follow up regarding your interest in our AI
automation solution. I'd be happy to arrange the product
demo next week.

Please let me know what time works best for you.

Best regards,
```

---

# ⚠️ AI Deployment Note

The AI model is currently **hosted and executed locally on the developer's PC using Ollama**.

The deployed Render backend **does not host the Llama 3.2 model**.

The current setup is therefore:

```text
Local Development
────────────────────────────────

FastAPI
   ↓
Ollama
   ↓
Llama 3.2:3b
   ↓
AI Follow-up Message
```

The web application itself is deployed on Render, but Ollama runs on the local development machine.

### Why?

Ollama was selected to run the Llama 3.2 model locally without depending on a paid external AI API.

This also allows the AI model to run without sending the lead's interaction notes to a third-party hosted AI API.

For a production deployment, the AI component could be moved to a cloud-hosted inference service or a dedicated model server.

---

# 💻 Local Setup

## 1. Clone the Repository

```bash
git clone https://github.com/Atharvadesai512/AI-event-lead-manager.git
cd AI-event-lead-manager
```

---

# ⚙️ Backend Setup

Navigate to the backend:

```bash
cd backend
```

Create a virtual environment:

### Windows

```powershell
python -m venv .venv
```

Activate it:

```powershell
.venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Start FastAPI:

```bash
uvicorn app.main:app --reload
```

Backend:

```text
http://127.0.0.1:8000
```

FastAPI documentation:

```text
http://127.0.0.1:8000/docs
```

---

# 🤖 Ollama Setup

Install Ollama on the local computer.

Download the required model:

```bash
ollama pull llama3.2:3b
```

Run the model:

```bash
ollama run llama3.2:3b
```

The backend communicates with Ollama through the local Ollama service.

Make sure Ollama is running before using the AI follow-up feature locally.

---

# 🎨 Frontend Setup

Open another terminal:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file inside the `frontend` directory:

```env
VITE_API_URL=http://127.0.0.1:8000
```

Start the frontend:

```bash
npm run dev
```

Frontend:

```text
http://localhost:5173
```

---

# 🌐 Deployment

The application frontend and backend are deployed using Render.

## Frontend

Frontend service:

```text
AI-event-lead-manager-2
```

Production API environment variable:

```text
VITE_API_URL=https://ai-event-lead-manager-1.onrender.com
```

## Backend

Backend service:

```text
AI-event-lead-manager-1
```

Build command:

```bash
pip install -r requirements.txt
```

Start command:

```bash
uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

Backend URL:

```text
https://ai-event-lead-manager-1.onrender.com
```

---

# 🗄️ Database

The application uses **SQLite with SQLAlchemy**.

Database configuration:

```text
sqlite:///./event_leads.db
```

The database is automatically created when the FastAPI application starts.

SQLAlchemy provides structured database access and separates database operations from the API routes.

> For a production application, a managed database such as PostgreSQL would be a better choice for reliable persistent storage.

---

# 🔐 Environment Variables

### Local Frontend

```env
VITE_API_URL=http://127.0.0.1:8000
```

### Production Frontend

```env
VITE_API_URL=https://ai-event-lead-manager-1.onrender.com
```

No OpenAI API key is required because the AI feature uses locally hosted Ollama.

---

# 🧪 Testing Checklist

The following functionality was tested during development:

* [x] Add Lead
* [x] View Leads
* [x] Edit Lead
* [x] Delete Lead
* [x] Search Leads
* [x] Filter Leads
* [x] SQLite database persistence
* [x] FastAPI REST API
* [x] React frontend
* [x] Frontend-backend integration
* [x] AI follow-up generation using Ollama
* [x] Render deployment

---

# 🎯 Design Decisions

### FastAPI

FastAPI was selected for its simple REST API development, automatic documentation, request validation, and strong Python ecosystem.

### React

React provides a simple component-based frontend and makes it easy to manage lead data and UI state.

### SQLite

SQLite keeps the project lightweight and easy to set up without requiring a separate database server.

### SQLAlchemy

SQLAlchemy provides structured interaction with the SQLite database and keeps database operations separate from the API layer.

### Ollama + Llama 3.2

Ollama allows the Llama 3.2 model to run locally without requiring a paid external AI API.

---

# 🚀 Future Improvements

Potential improvements for a production version include:

* PostgreSQL database
* Authentication and authorization
* Pagination
* Lead activity history
* Automated follow-up reminders
* Email integration
* CSV/Excel export
* Lead analytics dashboard
* AI lead scoring
* AI-generated lead summaries
* Cloud-hosted AI inference
* Production monitoring and logging

---

# 👨‍💻 Author

**Atharva Desai**

M.Sc. Data Science & AI

GitHub:

https://github.com/Atharvadesai512

---

# 📄 Assignment Context

This project demonstrates a complete full-stack workflow including:

* Frontend development
* REST API development
* Database design
* CRUD operations
* Search and filtering
* AI integration
* Local LLM execution
* Git/GitHub workflow
* Cloud deployment
