import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { RouterLink } from '@angular/router';
import { ProfileService } from 'src/app/core/services/profile/profile.service';
import { MetricsService } from '../../core/services/metrics/metrics.service';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatIconModule,
    MatProgressBarModule,
    MatButtonModule,
  ],
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  providers: [ProfileService],
})
export class DashboardComponent implements OnInit {
  metrics: any[] = [];
  private readonly profileService = inject(ProfileService);
  constructor(private metricsService: MetricsService) {}

  ngOnInit() {
    this.metricsService.getMetrics().subscribe({
      next: (data) => (this.metrics = data),
      error: (err) => console.error('Failed to load metrics', err),
    });

    this.profileService.getProfile().subscribe({
      next: (data) => console.log('Profile data:', data),
      error: (err) => console.error('Failed to load profile', err),
    });
  }
}
