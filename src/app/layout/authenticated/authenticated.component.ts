import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterOutlet } from '@angular/router';
import { SessionManagerService } from '../../core/shared/services/session-manager/session-manager.service';
import { ToolbarComponent } from '../../core/ui/components/toolbar/toolbar.component';

@Component({
  standalone: true,
  imports: [CommonModule, RouterOutlet, ToolbarComponent, MatDialogModule],
  selector: 'app-authenticated',
  templateUrl: './authenticated.component.html',
  styleUrls: ['./authenticated.component.scss'],
  providers: [SessionManagerService],
})
export class AuthenticatedComponent implements OnInit {
  // private readonly refreshTokenService = inject(RefreshTokenService);
  // private readonly sessionTimer = inject(SessionTimerService);

  // protected readonly dialog = inject(MatDialog);
  // private readonly router = inject(Router);

  private readonly sessionManager = inject(SessionManagerService);
  isDarkMode = false;
  constructor() {}

  // ngOnInit() {
  //   this.sessionTimer.resetIdleTimer();
  //   this.refreshTokenService.startRefreshCycle();

  //   const theme = localStorage.getItem('theme');
  //   if (theme === 'dark') {
  //     document.body.classList.add('dark-theme');
  //   }

  //   merge(
  //     this.sessionTimer.on('IDLE_WARNING').pipe(
  //       switchMap(() => {
  //         return this.openDialog();
  //       })
  //     ),
  //     this.sessionTimer.on('SESSION_EXPIRED')
  //   )
  //     .pipe(tap(() => console.log('observe started')))
  //     .subscribe({
  //       next: (event) => {
  //         console.log('Session event:', event);
  //         if (event === 'SESSION_EXPIRED' || event === 'EXPIRED') {
  //           console.log('Performing auto-logout due to session expiration.');
  //           localStorage.clear();
  //           this.router.navigate(['/login']);
  //         }
  //       },
  //     });
  // }

  ngOnInit(): void {
    this.sessionManager.start();
  }
  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    document.body.classList.toggle('dark-theme', this.isDarkMode);
    localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
  }

  // openDialog(): Observable<string> {
  //   return this.dialog
  //     .open(IdleWarningDialogComponent, {
  //       width: '300px',
  //       data: { countdown: 10 },
  //     })
  //     .afterClosed()
  //     .pipe(
  //       tap((result) => {
  //         if (result === 'SESSION_RESUME') {
  //           this.sessionTimer.resumeSession();
  //         }
  //       })
  //     );
  // }
}
