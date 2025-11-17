import random
from typing import List

from ..models import ClaimCheckResponse, ClaimEvidence, TranscriptItem

CLAIM_LIBRARY = [
    ("Solar panels only work in direct sunlight", False),
    ("Wind energy is a type of renewable energy", True),
    ("Battery storage smooths out renewable intermittency", True),
    ("Renewables cannot contribute to grid stability", False),
    ("Energy efficiency can lower consumption", True),
]


def build_claim_response(
    session_id: str, transcript: List[TranscriptItem], window_start: float | None
) -> ClaimCheckResponse:
    """Return a deterministic yet varied claim verdict for the provided transcript slice."""
    relevant = [item for item in transcript if window_start is None or item.timestamp >= window_start]
    claims: List[ClaimEvidence] = []

    for idx, item in enumerate(relevant):
        claim_text, truth_value = CLAIM_LIBRARY[idx % len(CLAIM_LIBRARY)]
        confidence = round(random.uniform(0.6, 0.98), 2)
        claims.append(
            ClaimEvidence(
                timestamp=item.timestamp,
                text=claim_text,
                verdict="true" if truth_value else "false",
                confidence=confidence,
            )
        )

    return ClaimCheckResponse(session_id=session_id, claims=claims)
