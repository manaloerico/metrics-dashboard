// src/app/services/metrics.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Metric } from './model/metric.model';

@Injectable({ providedIn: 'root' })
export class MetricsService {
  private apiUrl = `metrics`;

  constructor(private http: HttpClient) {}

  getMetrics(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  createMetric(data: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, data);
  }

  updateMetric(id: string, data: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, data);
  }

  deleteMetric(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  addEntry(id: string, data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}/entry`, data);
  }
  getMetricById(id: string): Observable<Metric> {
    return this.http.get<Metric>(`${this.apiUrl}/${id}`);
  }
}
