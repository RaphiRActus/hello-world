import { Component, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { interval, Subscription } from 'rxjs';
import { environment } from '../environments/environment';

interface TranscriptItem {
  timestamp: number;
  text: string;
}

interface SessionResponse {
  session_id: string;
  transcript: TranscriptItem[];
}

interface ClaimEvidence {
  timestamp: number;
  text: string;
  verdict: string;
  confidence: number;
}

interface ClaimCheckResponse {
  session_id: string;
  claims: ClaimEvidence[];
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnDestroy {
  videoUrl = '';
  sessionId = '';
  transcript: TranscriptItem[] = [];
  claims: ClaimEvidence[] = [];
  statusMessage = 'Enter a video URL to begin.';
  private pollSub?: Subscription;

  constructor(private http: HttpClient) {}

  ngOnDestroy(): void {
    this.pollSub?.unsubscribe();
  }

  startSession(): void {
    if (!this.videoUrl) {
      this.statusMessage = 'Please provide a video URL.';
      return;
    }

    this.statusMessage = 'Starting session and fetching transcript...';
    this.http
      .post<SessionResponse>(`${environment.apiBaseUrl}/api/sessions`, { url: this.videoUrl })
      .subscribe((session) => {
        this.sessionId = session.session_id;
        this.transcript = session.transcript;
        this.statusMessage = 'Live transcript ready. Claim checks will update every 10 seconds.';
        this.startClaimPolling();
      });
  }

  private startClaimPolling(): void {
    this.pollSub?.unsubscribe();
    this.pollSub = interval(10000).subscribe(() => this.fetchClaims());
    this.fetchClaims();
  }

  fetchTranscript(): void {
    if (!this.sessionId) return;
    this.http
      .get<SessionResponse>(`${environment.apiBaseUrl}/api/sessions/${this.sessionId}/transcript`)
      .subscribe((session) => (this.transcript = session.transcript));
  }

  fetchClaims(): void {
    if (!this.sessionId) return;
    this.http
      .post<ClaimCheckResponse>(`${environment.apiBaseUrl}/api/claims`, {
        session_id: this.sessionId,
        window_start_seconds: this.transcript.length ? this.transcript[0].timestamp : 0
      })
      .subscribe((response) => {
        this.claims = response.claims;
      });
  }
}
