/**
 * Authentication and Authorization module
 * @module auth
 *
 * This module provides comprehensive authentication and authorization functionality:
 * - User authentication (login, register, logout, OAuth)
 * - Token management (automatic refresh, storage)
 * - Permission-based access control
 * - Role-based access control
 * - Session management (inactivity timeout, cross-tab sync)
 * - Guards for route protection
 * - Directives for conditional rendering
 *
 * @example
 * ```typescript
 * // Configure auth in your app
 * import { provideAuth } from '@labyrinth/ng-admin-core/auth';
 *
 * export const appConfig: ApplicationConfig = {
 *   providers: [
 *     provideAuth({
 *       endpoints: {
 *         login: '/auth/login',
 *         register: '/auth/register',
 *         // ... other endpoints
 *       },
 *       token: {
 *         storage: 'memory',
 *       },
 *       session: {
 *         inactivityTimeout: 30 * 60 * 1000,
 *       }
 *     })
 *   ]
 * };
 * ```
 */

// Configuration
export * from './config';

// Models
export * from './models';

// Services
export * from './services';

// Directives
export * from './directives';

// Interceptors
export * from './interceptors';

// Guards
export * from './guards';

// schemas
export * from './schemas';
