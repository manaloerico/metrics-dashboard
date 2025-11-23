import { inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { SessionTimerService } from '@session-management';
import { RefreshTokenService } from '@session-management/service/refresh-token/refresh-token.service';
import { merge, Observable, switchMap, tap } from 'rxjs';
import { IdleWarningDialogComponent } from 'src/app/common/components/idle-warning-dialog/idle-warning-dialog.component';

@Injectable()
export class SessionManagerService {
  private readonly refreshTokenService = inject(RefreshTokenService);
  private readonly sessionTimer = inject(SessionTimerService);

  protected readonly dialog = inject(MatDialog);
  private readonly router = inject(Router);
  constructor() {}

  start() {
    this.sessionTimer.startSession();

    merge(
      this.sessionTimer
        .on('IDLE_WARNING')
        .pipe(switchMap(() => this.openDialog())),
      this.sessionTimer.on('SESSION_EXPIRED')
    ).subscribe((event) => {
      if (event === 'SESSION_EXPIRED' || event === 'EXPIRED') {
        localStorage.clear();
        this.router.navigate(['/login']);
      }
    });
  }

  private openDialog(): Observable<string> {
    return this.dialog
      .open(IdleWarningDialogComponent, {
        width: '300px',
        data: { countdown: 10 },
      })
      .afterClosed()
      .pipe(
        tap((result) => {
          if (result === 'SESSION_RESUME') {
            this.sessionTimer.resumeSession();
          }
        })
      );
  }
}
