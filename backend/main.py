from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from uuid import uuid4
from typing import Dict, List

from .models import ClaimCheckRequest, ClaimCheckResponse, SessionResponse, TranscriptItem, VideoSessionRequest
from .services.claims import build_claim_response
from .services.transcript import generate_transcript

app = FastAPI(title="Video Claim Checker")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory demo store. In production, replace with persistent state.
sessions: Dict[str, List[TranscriptItem]] = {}


@app.post("/api/sessions", response_model=SessionResponse)
def create_session(payload: VideoSessionRequest) -> SessionResponse:
    """Create a new video analysis session and precompute sample transcript."""
    if not payload.url:
        raise HTTPException(status_code=400, detail="Video URL is required")

    session_id = str(uuid4())
    transcript = generate_transcript(payload.url)
    sessions[session_id] = transcript
    return SessionResponse(session_id=session_id, transcript=transcript)


@app.get("/api/sessions/{session_id}/transcript", response_model=SessionResponse)
def get_transcript(session_id: str) -> SessionResponse:
    """Return the transcript for the requested session."""
    transcript = sessions.get(session_id)
    if transcript is None:
        raise HTTPException(status_code=404, detail="Session not found")
    return SessionResponse(session_id=session_id, transcript=transcript)


@app.post("/api/claims", response_model=ClaimCheckResponse)
def check_claims(payload: ClaimCheckRequest) -> ClaimCheckResponse:
    """Mock claim validation against the transcript snapshot."""
    transcript = sessions.get(payload.session_id)
    if transcript is None:
        raise HTTPException(status_code=404, detail="Session not found")

    return build_claim_response(payload.session_id, transcript, payload.window_start_seconds)
