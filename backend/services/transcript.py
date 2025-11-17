from typing import List

from ..models import TranscriptItem

# Sample text blocks to mimic a streaming transcript.
TRANSCRIPT_SNIPPETS = [
    "Welcome to our exploration of sustainable energy.",
    "Solar panels convert sunlight directly into electricity.",
    "Some people believe solar panels only work in direct sunlight, but they also generate power on cloudy days.",
    "Wind turbines harness kinetic energy from the wind and feed it into the grid.",
    "Battery storage helps balance supply and demand by storing excess energy for later.",
    "Critics sometimes claim renewable energy is too unreliable, yet modern grids blend multiple sources to stay stable.",
    "Energy efficiency measures can reduce household consumption by up to 30 percent.",
    "Policy incentives and innovation keep driving renewable adoption worldwide.",
]


def generate_transcript(url: str) -> List[TranscriptItem]:
    """Return a mocked transcript timeline for the provided video URL."""
    transcript: List[TranscriptItem] = []
    for index, snippet in enumerate(TRANSCRIPT_SNIPPETS):
        transcript.append(TranscriptItem(timestamp=float(index * 10), text=snippet))
    return transcript
