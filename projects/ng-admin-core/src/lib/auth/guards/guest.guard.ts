/**
 * Guest guard (unauthenticated users only)
 * @module core/guards
 */

import { inject, PLATFORM_ID } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AUTH_CONFIG } from '../config/auth-config';

/**
 * Guard to protect routes that should only be accessible to unauthenticated users
 * Useful for login, register pages
 *
 * @example
 * ```typescript
 * // app.routes.ts
 * import { guestGuard } from '@labyrinth/ng-admin-core';
 *
 * export const routes: Routes = [
 *   {
 *     path: 'login',
 *     component: LoginComponent,
 *     canActivate: [guestGuard]
 *   }
 * ];
 * ```
 */
export const guestGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const authConfig = inject(AUTH_CONFIG);

  // If user is authenticated, redirect to home
  if (authService.isAuthenticated()) {
    const homeRoute = authConfig.routes.afterLogin || '/';
    router.navigate([homeRoute]);
    return false;
  }

  return true;
};
