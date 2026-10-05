AI Event Lead Manager

A full-stack application for managing event leads,
tracking follow-ups, and generating AI-powered follow-up
messages.

Tech Stack
- React
- FastAPI
- SQLite
- SQLAlchemy
- Ollama
- Llama 3.2

Features
- Create leads
- View leads
- Edit leads
- Delete leads
- Search leads
- Filter leads
- AI-generated follow-up messages
- Persistent SQLite storage

Architecture

React Frontend
      ↓
FastAPI REST API
      ↓
SQLAlchemy
      ↓
SQLite

AI:
FastAPI → Ollama → Llama 3.2