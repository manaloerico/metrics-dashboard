import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { SessionTimerService } from '@session-management';
import { RefreshTokenService } from '@session-management/service/refresh-token/refresh-token.service';
import { tap } from 'rxjs';

export const activityInterceptor: HttpInterceptorFn = (req, next) => {
  const sessionTimer = inject(SessionTimerService);
  const refreshTokenService = inject(RefreshTokenService);

  return next(req).pipe(
    tap(() => {
      // Restart refresh cycle ONLY for non-refresh calls
      if (!req.url.includes('/refresh')) {
        // Always reset idle timer
        sessionTimer.resetIdleTimer();
        refreshTokenService.startRefreshCycle();
      }
    })
  );
};
