import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ModuleWithProviders, NgModule } from '@angular/core';
import {
  activityInterceptor,
  authInterceptor,
  SessionTimerService,
} from '@session-management';
import { RefreshTokenService } from './service/refresh-token/refresh-token.service';
import { SessionManagementConfig } from './types/types';
@NgModule({})
export class SessionManagementModule {
  static forRoot(
    config: SessionManagementConfig
  ): ModuleWithProviders<SessionManagementModule> {
    return {
      ngModule: SessionManagementModule,
      providers: [
        { provide: 'SESSION_CONFIG', useValue: config },
        // SessionManagementService,
        // provideHttpClient(withInterceptors([AuthInterceptor])),
        SessionTimerService,
        RefreshTokenService,
        provideHttpClient(
          withInterceptors([activityInterceptor, authInterceptor])
        ),
      ],
    };
  }
}
