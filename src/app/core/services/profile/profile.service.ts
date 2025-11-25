import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class ProfileService {
  private apiUrl = `profile`;

  constructor(private http: HttpClient) {}
  getProfile(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}
