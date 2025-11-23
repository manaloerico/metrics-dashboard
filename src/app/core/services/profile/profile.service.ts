import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/app/environments/environtment';

@Injectable()
export class ProfileService {
  private apiUrl = `${environment.apiUrl}/profile`;

  constructor(private http: HttpClient) {}
  getProfile(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}
