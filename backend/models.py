from typing import List, Optional
from pydantic import BaseModel, HttpUrl


class TranscriptItem(BaseModel):
    timestamp: float
    text: str


class VideoSessionRequest(BaseModel):
    url: HttpUrl


class SessionResponse(BaseModel):
    session_id: str
    transcript: List[TranscriptItem]


class ClaimCheckRequest(BaseModel):
    session_id: str
    window_start_seconds: Optional[float] = None


class ClaimEvidence(BaseModel):
    timestamp: float
    text: str
    verdict: str
    confidence: float


class ClaimCheckResponse(BaseModel):
    session_id: str
    claims: List[ClaimEvidence]
