import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { AuthenticatedComponent } from './layout/authenticated/authenticated.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { LoginComponent } from './pages/login/login.component';
import { MetricsDetailsComponent } from './pages/metrics-details/metrics-details.component';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },

  // Public routes
  { path: 'login', component: LoginComponent },
  //{ path: 'register', component: RegisterComponent },
  // {
  //   path: '',
  //   component: UnauthenticatedComponent,
  //   children: [
  //     {
  //       path: 'login',
  //       component: LoginComponent,
  //     },
  //   ],
  // },
  // Protected dashboard routes
  {
    path: '',
    component: AuthenticatedComponent,
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'metrics/:id', component: MetricsDetailsComponent },
    ],
  },

  // Wildcard fallback
  { path: '**', redirectTo: 'dashboard' },
];
