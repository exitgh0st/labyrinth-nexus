/**
 * Authentication guard
 * @module core/guards
 */

import { inject, PLATFORM_ID } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AUTH_CONFIG } from '../config/auth-config';

/**
 * Guard to protect routes that require authentication
 *
 * @example
 * ```typescript
 * // app.routes.ts
 * import { authGuard } from '@labyrinth/ng-admin-core';
 *
 * export const routes: Routes = [
 *   {
 *     path: 'dashboard',
 *     component: DashboardComponent,
 *     canActivate: [authGuard]
 *   }
 * ];
 * ```
 */
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const authConfig = inject(AUTH_CONFIG);

  // Check if user is authenticated
  if (authService.isAuthenticated()) {
    return true;
  }

  // Redirect to login with return URL
  const loginRoute = authConfig.routes.login || '/login';
  router.navigate([loginRoute], {
    queryParams: { returnUrl: state.url },
  });

  return false;
};
