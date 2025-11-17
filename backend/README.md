# Backend (FastAPI)

This mock backend exposes endpoints to simulate live transcript generation and claim verification for a video stream.

## Running locally

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn backend.main:app --reload
```

## Endpoints
- `POST /api/sessions` – start a session with a video URL and return a sample transcript.
- `GET /api/sessions/{session_id}/transcript` – fetch the transcript for the session.
- `POST /api/claims` – return mocked claim checks for the transcript (meant to be called every 10 seconds).
