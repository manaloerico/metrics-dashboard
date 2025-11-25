// import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

// import { AppModule } from './app/app.module';

// platformBrowserDynamic().bootstrapModule(AppModule)
//   .catch(err => console.error(err));

import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { MatNativeDateModule } from '@angular/material/core';
import { MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';
import { bootstrapApplication } from '@angular/platform-browser';
import {
  BrowserAnimationsModule,
  provideAnimations,
} from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { SessionManagementModule } from '@session-management';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routing';
import { AuthInterceptor } from './app/core/interceptors/auth.interceptors';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([AuthInterceptor])),
    importProvidersFrom(BrowserAnimationsModule),
    provideAnimations(),
    importProvidersFrom(MatNativeDateModule),
    { provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: { hasBackdrop: true } },
    importProvidersFrom(
      SessionManagementModule.forRoot({
        accessTokenKey: 'access_token',
        refreshTokenKey: 'refresh_token',
        refreshBeforeExpiryMs: 1_000,
        refreshTokenEndpoint: 'http://localhost:4000/api/refresh',
        onRefreshTokenFailure: () => {
          console.log('Refresh token failed - custom handler');
        },
      })
    ),
  ],
}).catch((err) => console.error(err));
