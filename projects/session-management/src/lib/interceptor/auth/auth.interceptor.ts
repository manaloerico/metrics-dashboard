import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { SessionManagementService } from '@session-management';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, filter, switchMap, take, tap } from 'rxjs/operators';

// Singleton refresh state to persist across multiple HTTP calls
const refreshState = (() => {
  const refreshSubject = new BehaviorSubject<string | null>(null);
  let isRefreshing = false;

  return {
    getSubject: () => refreshSubject,
    getIsRefreshing: () => isRefreshing,
    setIsRefreshing: (val: boolean) => {
      isRefreshing = val;
    },
  };
})();

export const AuthInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<HttpEvent<any>> => {
  const session = inject(SessionManagementService);

  // Register API call for idle refresh
  session.registerApiCall();

  // Attach access token if available
  let authReq = req;
  if (session.accessToken) {
    authReq = req.clone({
      setHeaders: { Authorization: `Bearer ${session.accessToken}` },
    });
  }

  return next(authReq).pipe(
    catchError((err) => {
      if (err instanceof HttpErrorResponse && err.status === 401) {
        return handle401(authReq, next, session);
      }
      return throwError(() => err);
    })
  );
};

function handle401(
  req: HttpRequest<any>,
  next: HttpHandlerFn,
  session: SessionManagementService
): Observable<HttpEvent<any>> {
  if (!refreshState.getIsRefreshing()) {
    refreshState.setIsRefreshing(true);
    refreshState.getSubject().next(null);

    return session.refreshTokens().pipe(
      tap((tokens) => {
        refreshState.setIsRefreshing(false);
        refreshState.getSubject().next(tokens.access_token);
      }),
      switchMap((tokens) => {
        return next(
          req.clone({
            setHeaders: { Authorization: `Bearer ${tokens.access_token}` },
          })
        );
      }),
      catchError((err) => {
        refreshState.setIsRefreshing(false);
        session.clearTokens();
        return throwError(() => err);
      })
    );
  }

  // If a refresh is already in progress, wait for the new token
  return refreshState.getSubject().pipe(
    filter((token) => token !== null),
    take(1),
    switchMap((token) =>
      next(
        req.clone({
          setHeaders: { Authorization: `Bearer ${token}` },
        })
      )
    )
  );
}
