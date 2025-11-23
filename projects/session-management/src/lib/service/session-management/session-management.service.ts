import { HttpClient } from '@angular/common/http';
import { inject, Inject, Injectable, Optional } from '@angular/core';
import { catchError, Subscription, tap, throwError, timer } from 'rxjs';
import { SessionManagementConfig, Tokens } from '../../types/types';

@Injectable()
export class SessionManagementService {
  accessToken?: string;
  refreshToken?: string;
  private idleTimeout?: Subscription;

  private accessTokenKey: string;
  private refreshTokenKey: string;
  private refreshBeforeExpiryMs: number;

  private lastApiCall: number = Date.now();
  private idleDuration = 1 * 60 * 1000; // 14 minutes

  private readonly http = inject(HttpClient);
  constructor(
    @Optional()
    @Inject('SESSION_CONFIG')
    private config?: SessionManagementConfig
  ) {
    this.accessTokenKey = config?.accessTokenKey || 'access_token';
    this.refreshTokenKey = config?.refreshTokenKey || 'refresh_token';
    this.refreshBeforeExpiryMs = config?.refreshBeforeExpiryMs || 1_000;
    if (!config?.refreshTokenEndpoint) {
      throw new Error(
        'SessionService requires a refreshTokens function from consuming app'
      );
    }

    this.accessToken = localStorage.getItem(this.accessTokenKey) || undefined;
    this.refreshToken = localStorage.getItem(this.refreshTokenKey) || undefined;

    if (this.accessToken && this.refreshToken) {
      this.resetIdleTimer();
    }
  }
  setTokens(tokens: Tokens) {
    this.accessToken = tokens.access_token;
    this.refreshToken = tokens.refresh_token;
    localStorage.setItem(this.accessTokenKey, this.accessToken);
    localStorage.setItem(this.refreshTokenKey, this.refreshToken);
    this.resetIdleTimer();
  }

  clearTokens() {
    this.accessToken = undefined;
    this.refreshToken = undefined;
    localStorage.removeItem(this.accessTokenKey);
    localStorage.removeItem(this.refreshTokenKey);
    this.idleTimeout?.unsubscribe();
  }

  registerApiCall() {
    this.lastApiCall = Date.now();
    this.resetIdleTimer();
  }

  refreshTokens() {
    if (!this.refreshToken)
      return throwError(() => new Error('No refresh token'));

    const httpCall$ = this.http.post<Tokens>(
      this.config!.refreshTokenEndpoint,
      { refresh_token: this.refreshToken }
    );
    return httpCall$.pipe(
      tap((tokens) => this.setTokens(tokens)),
      catchError((err) => {
        this.clearTokens();
        throw err;
      })
    );
  }

  private resetIdleTimer() {
    this.idleTimeout?.unsubscribe();

    const timeSinceLastCall = Date.now() - this.lastApiCall;
    console.log('timeSinceLastCall', timeSinceLastCall);
    const delay = Math.max(this.idleDuration - timeSinceLastCall, 0);

    console.log('timeSinceLastCall', timeSinceLastCall, delay);
    this.idleTimeout = timer(delay)
      .pipe(tap((t) => console.log('timer', t)))
      .subscribe(() => {
        this.refreshTokens().subscribe({
          next: () => console.log('Silent refresh triggered by API idle'),
          error: () => console.log('Silent refresh failed, tokens cleared'),
        });
      });
  }
}
