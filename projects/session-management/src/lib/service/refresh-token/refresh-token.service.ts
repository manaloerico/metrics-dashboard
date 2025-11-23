import { HttpClient } from '@angular/common/http';
import { inject, Inject, Injectable, Optional } from '@angular/core';
import { SessionManagementConfig, Tokens } from '@session-management';
import { tap } from 'rxjs';

@Injectable()
export class RefreshTokenService {
  private refreshTimer: any;
  //private readonly REFRESH_INTERVAL = 14 * 60 * 1000; // 14 minutes
  private readonly REFRESH_INTERVAL = 2 * 60 * 1000;
  private readonly http = inject(HttpClient);

  private accessTokenKey: string;
  private refreshTokenKey: string;
  private accessToken?: string;
  private refreshToken?: string;
  private refreshTokenEndpoint: string | undefined;
  constructor(
    @Optional()
    @Inject('SESSION_CONFIG')
    private config?: SessionManagementConfig
  ) {
    this.refreshTokenEndpoint = this.config?.refreshTokenEndpoint;
    if (!this.refreshTokenEndpoint) {
      throw new Error(
        'RefreshTokenService requires a refreshTokenEndpoint from consuming app'
      );
    }
    this.accessTokenKey = config?.accessTokenKey || 'access_token';
    this.refreshTokenKey = config?.refreshTokenKey || 'refresh_token';
  }

  setTokens(tokens: Tokens) {
    this.accessToken = tokens.access_token;
    this.refreshToken = tokens.refresh_token;
    localStorage.setItem(this.accessTokenKey, this.accessToken);
    localStorage.setItem(this.refreshTokenKey, this.refreshToken);
  }

  clearTokens() {
    this.accessToken = undefined;
    this.refreshToken = undefined;
    localStorage.removeItem(this.accessTokenKey);
    localStorage.removeItem(this.refreshTokenKey);
    clearTimeout(this.refreshTimer);
  }

  startRefreshCycle() {
    clearTimeout(this.refreshTimer);

    this.refreshTimer = setTimeout(() => {
      const refreshTokenEndpoint = this.config?.refreshTokenEndpoint;
      if (!refreshTokenEndpoint) {
        throw new Error(
          'RefreshTokenService requires a refreshTokenEndpoint from consuming app'
        );
      }
      this.http
        .post<Tokens>(this.config!.refreshTokenEndpoint, {
          refresh_token: localStorage.getItem(
            this.config?.refreshTokenKey || 'refresh_token'
          ),
        })
        .pipe(
          tap(() =>
            console.log(
              'Refreshing token...',
              new Date().getHours() +
                ':' +
                new Date().getMinutes() +
                ':' +
                new Date().getSeconds()
            )
          )
        )
        .subscribe({
          next: (tokens) => {
            this.setTokens(tokens);
            //this.startRefreshCycle();
          },
          error: () => {
            this.clearTokens();
            this.config!.onRefreshTokenFailure();
          },
        });
    }, this.REFRESH_INTERVAL);
  }
}
