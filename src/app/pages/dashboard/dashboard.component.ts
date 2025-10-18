import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { MetricsService } from '../../core/services/metrics/metrics.service';

@Component({
  standalone: true,
  imports: [CommonModule, RouterLink, MatCardModule, MatIconModule],
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  metrics: any[] = [];

  constructor(private metricsService: MetricsService) {}

  ngOnInit() {
    this.metricsService.getMetrics().subscribe({
      next: (data) => (this.metrics = data),
      error: (err) => console.error('Failed to load metrics', err),
    });
  }
}
