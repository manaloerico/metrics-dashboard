import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTableModule } from '@angular/material/table';
import { ActivatedRoute, ɵEmptyOutletComponent } from '@angular/router';
import { MetricsService } from '../../core/services/metrics/metrics.service';
import { Metric } from '../../core/services/metrics/model/metric.model';
import { AddEditMetricDetailDialogComponent } from './components/add-edit-metric-detail-dialog/add-edit-metric-detail-dialog.component';
@Component({
  selector: 'app-metrics-details',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatProgressBarModule,
    MatDialogModule,
    MatTableModule,
    MatIconModule,
    ɵEmptyOutletComponent,
  ],
  templateUrl: './metrics-details.component.html',
  styleUrls: ['./metrics-details.component.scss'],
})
export class MetricsDetailsComponent implements OnInit {
  metric!: Metric;
  readonly dialog = inject(MatDialog);
  reports!: { date: string; value: number; achieved: boolean }[];
  successRate!: string;
  longestStreak!: any;

  get id() {
    return this.route.snapshot.paramMap.get('id');
  }

  constructor(
    private route: ActivatedRoute,
    private metricService: MetricsService
  ) {}

  ngOnInit() {
    if (this.id) {
      this.metricService.getMetricById(this.id).subscribe((metric) => {
        this.metric = metric;

        const grouped = metric.entries.reduce((acc, entry) => {
          const day = new Date(entry.date).toISOString().slice(0, 10);
          if (!acc[day]) acc[day] = [];
          acc[day].push(entry.value);
          return acc;
        }, [] as unknown as { [key: string]: number[] });
        const reports = Object.entries(grouped)
          .map(([date, values]) => {
            const dayValue = this.computeDailyValue(values, metric.type) || 0;
            const achieved = dayValue >= metric.target;
            return {
              date,
              value: dayValue,
              achieved,
            };
          })
          .sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          );
        this.reports = reports;

        const totalDays = reports.length;
        const achievedDays = reports.filter((r) => r.achieved).length;
        this.successRate = ((achievedDays / totalDays) * 100).toFixed(1) + '%';
        this.longestStreak = this.getLongestStreak(
          this.reports as unknown as any
        );
        // this.renderChart(metric);
      });
    }
  }
  private computeDailyValue = (values: number[], type: string) => {
    return type === 'cumulative'
      ? values.reduce((a, b) => a + b, 0)
      : values.at(-1); // latest value for "point" metrics
  };
  private add() {
    if (this.metric == null) return;
    const newEntry = {
      date: new Date().toISOString().split('T')[0],
      value: Math.floor(Math.random() * 100),
    };
    this.metricService
      .addEntry(this.metric._id, 3)
      .subscribe((updatedMetric) => {
        this.metric = updatedMetric;
        // Optionally, re-render the chart if needed
        // this.renderChart(this.metric);
      });
  }

  openDialog(): void {
    this.dialog
      .open(AddEditMetricDetailDialogComponent)
      .afterClosed()
      .subscribe((result) => {
        console.log(result);
        if (result && this.metric) {
          this.metricService
            .addEntry(this.metric._id, result)
            .subscribe((updatedMetric) => {
              this.metric = updatedMetric;
              // Optionally, re-render the chart if needed
              // this.renderChart(this.metric);
            });
        }
      });
  }

  // renderChart(metric: Metric) {
  //   const ctx = document.getElementById('metricChart') as HTMLCanvasElement;
  //   const labels = metric.history.map(h => h.date);
  //   const values = metric.history.map(h => h.value);

  //   new Chart(ctx, {
  //     type: 'line',
  //     data: {
  //       labels,
  //       datasets: [
  //         {
  //           label: metric.name,
  //           data: values,
  //           borderWidth: 2,
  //           borderColor: '#3f51b5',
  //           fill: false,
  //           tension: 0.1,
  //         },
  //       ],
  //     },
  //     options: {
  //       responsive: true,
  //       plugins: {
  //         legend: { display: false },
  //       },
  //       scales: {
  //         y: { beginAtZero: true },
  //       },
  //     },
  //   });
  // }

  getLongestStreak(data: { date: string; achieved: boolean }[]) {
    if (!data?.length) {
      return { length: 0, startDate: null, endDate: null, dates: [] };
    }

    // Sort ascending by date
    const sorted = [...data].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    let longest = {
      length: 0,
      startDate: '',
      endDate: '',
      dates: [] as any,
    };
    let current = {
      length: 0,
      startDate: '',
      endDate: '',
      dates: [] as any,
    };

    const isNextDay = (prev: string, next: string): boolean => {
      const prevDate = new Date(prev);
      const nextDate = new Date(next);
      const diffDays =
        (nextDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24);
      return diffDays === 1;
    };

    for (const [i, { date, achieved }] of sorted.entries()) {
      if (!achieved) {
        // End current streak if broken
        if (current.length > longest.length) longest = { ...current };
        current = { length: 0, startDate: '', endDate: '', dates: [] };
        continue;
      }

      if (current.length > 0 && i > 0 && isNextDay(sorted[i - 1].date, date)) {
        // Continue streak
        current = {
          ...current,
          length: current.length + 1,
          endDate: date,
          dates: [...current.dates, date],
        };
      } else {
        // Start new streak
        current = { length: 1, startDate: date, endDate: date, dates: [date] };
      }

      if (current.length > longest.length) longest = { ...current };
    }

    return longest;
  }
}
