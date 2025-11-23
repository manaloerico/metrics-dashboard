import { inject, Injectable } from '@angular/core';
import { filter, map, Observable, Subject } from 'rxjs';
import { RefreshTokenService } from '../refresh-token/refresh-token.service';

@Injectable()
export class SessionTimerService {
  private idleTimer: any;
  private warningTimer: any;

  // private readonly IDLE_LIMIT = 14 * 60 * 1000 + 50 * 1000; // 14min 50sec
  private readonly IDLE_LIMIT = 1 * 60 * 1000 + 50 * 1000;
  private readonly WARNING_DURATION = 10 * 1000; // 10sec
  private events$ = new Subject<{ name: string; data?: string }>();
  onTimeoutWarning = new Subject<void>();
  onSessionExpired = new Subject<void>();
  private readonly refreshTokenService = inject(RefreshTokenService);
  constructor() {
    // this.resetIdleTimer();
    // this.refreshTokenService.startRefreshCycle();
  }
  resumeSession() {
    this.refreshTokenService.startRefreshCycle();
  }
  startSession() {
    this.resetIdleTimer();
    this.refreshTokenService.startRefreshCycle();
  }
  resetIdleTimer() {
    clearTimeout(this.idleTimer);
    clearTimeout(this.warningTimer);
    console.log(
      'Idle timer reset',
      new Date().getHours() +
        ':' +
        new Date().getMinutes() +
        ':' +
        new Date().getSeconds()
    );
    this.idleTimer = setTimeout(() => {
      console.log(
        'Idle timeout warning triggered',
        new Date().getHours() +
          ':' +
          new Date().getMinutes() +
          ':' +
          new Date().getSeconds()
      );
      // this.onTimeoutWarning.next(); // triggers the dialog
      this.emit('IDLE_WARNING', 'IDLE_WARNING');
      this.warningTimer = setTimeout(() => {
        // this.onSessionExpired.next(); // auto-logout

        this.emit('SESSION_EXPIRED', 'SESSION_EXPIRED');
        console.log(
          'session expired triggered',
          new Date().getHours() +
            ':' +
            new Date().getMinutes() +
            ':' +
            new Date().getSeconds()
        );
      }, this.WARNING_DURATION);
    }, this.IDLE_LIMIT);
  }
  emit(name: string, data?: any) {
    this.events$.next({ name, data });
  }
  on(name: string): Observable<string | undefined> {
    return this.events$.pipe(
      filter((event) => event.name === name),
      map((event) => event.data)
    );
  }
}
