// src/app/services/auth.service.ts
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { RefreshTokenService } from '@session-management/service/refresh-token/refresh-token.service';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environtment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  private tokenKey = 'jwt_token';
  // private readonly sessionService = inject(SessionManagementService);
  private readonly sessionService = inject(RefreshTokenService);
  constructor(private http: HttpClient) {}

  register(name: string, email: string, password: string) {
    return this.http.post(`${this.apiUrl}/register`, { name, email, password });
  }

  login(email: string, password: string) {
    return this.http
      .post<{ refresh_token: string; access_token: string; user: any }>(
        `${this.apiUrl}/login`,
        {
          email,
          password,
        }
      )
      .pipe(
        tap((res) => {
          this.sessionService.setTokens({
            access_token: res.access_token,
            refresh_token: res.refresh_token,
          });
          localStorage.setItem(this.tokenKey, res.access_token);
        })
      );
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
    this.sessionService.clearTokens();
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}
