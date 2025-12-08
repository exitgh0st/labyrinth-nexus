# Architecture Documentation

## Table of Contents

1. [Overview](#overview)
2. [Technology Stack](#technology-stack)
3. [Project Structure](#project-structure)
4. [Architecture Patterns](#architecture-patterns)
5. [Data Flow](#data-flow)
6. [State Management](#state-management)
7. [Authentication & Authorization](#authentication--authorization)
8. [Routing Strategy](#routing-strategy)
9. [Library: ng-admin-core](#library-ng-admin-core)
10. [Performance Optimizations](#performance-optimizations)
11. [Security Architecture](#security-architecture)

---

## Overview

Labyrinth Nexus is a modern Angular 20 admin starter template built with:
- **Standalone components** (no NgModules)
- **Signals-first reactivity** (Angular's new reactive primitive)
- **Feature-based architecture** (modular and scalable)
- **Comprehensive authentication/authorization** (via ng-admin-core library)

### Design Principles

1. **Modularity** - Feature-based structure for easy scaling
2. **Type Safety** - Strict TypeScript mode enforced
3. **Performance** - Lazy loading, OnPush detection, signals
4. **Security** - JWT auth, RBAC, secure defaults
5. **Developer Experience** - Clear patterns, good documentation

---

## Technology Stack

### Core Framework
- **Angular 20.1** - Latest stable version
- **TypeScript 5.8** - Strict mode enabled
- **RxJS 7.8** - Reactive programming

### UI & Styling
- **Angular Material 20** - Material Design components
- **Angular CDK 20** - Component Dev Kit utilities
- **SCSS** - CSS preprocessing

### Validation & Forms
- **Zod 4.1** - Schema validation
- **Reactive Forms** - Angular forms with validation

### Authentication
- **@labyrinth-team/ng-admin-core** - Custom auth/authz library
- **JWT tokens** - Access + refresh token pattern
- **HTTP-only cookies** - Refresh token storage

### Build & Development
- **Angular CLI 20** - Build tooling
- **ESBuild** - Fast bundler (via Angular build)
- **Karma + Jasmine** - Testing framework

---

## Project Structure

```
labyrinth-nexus/
├── .github/
│   └── workflows/          # CI/CD pipelines
│       └── ci.yml
├── .husky/                 # Git hooks
│   ├── pre-commit
│   └── commit-msg
├── docs/                   # Documentation
│   ├── ARCHITECTURE.md     # This file
│   └── API-INTEGRATION.md  # API integration guide
├── projects/
│   └── ng-admin-core/      # Authentication library
├── src/
│   ├── app/
│   │   ├── core/           # Singleton services, guards, interceptors
│   │   │   ├── config/
│   │   │   │   └── app.constants.ts
│   │   │   ├── components/
│   │   │   │   └── navigation/
│   │   │   ├── interceptors/
│   │   │   │   └── logging.interceptor.ts
│   │   │   └── services/
│   │   │       ├── app-config.service.ts
│   │   │       ├── app-initializer.ts
│   │   │       └── global-error-handler.service.ts
│   │   ├── features/       # Feature modules
│   │   │   ├── auth/       # Authentication feature
│   │   │   │   ├── pages/
│   │   │   │   │   ├── login/
│   │   │   │   │   ├── register/
│   │   │   │   │   └── unauthorized/
│   │   │   │   └── auth.routes.ts
│   │   │   ├── dashboard/  # Dashboard feature
│   │   │   ├── users/      # User management
│   │   │   │   ├── models/
│   │   │   │   ├── pages/
│   │   │   │   ├── services/
│   │   │   │   └── enums/
│   │   │   ├── roles/      # Role management
│   │   │   ├── sessions/   # Session management
│   │   │   ├── profile/    # User profile
│   │   │   └── admin-settings/
│   │   ├── shared/         # Shared utilities
│   │   │   └── schemas/    # Zod validation schemas
│   │   ├── app.component.ts
│   │   ├── app.config.ts   # Application configuration
│   │   └── app.routes.ts   # Root routing
│   ├── assets/
│   │   └── config/
│   │       ├── app-config.json
│   │       └── app-config.example.json
│   ├── environments/
│   │   ├── environment.ts
│   │   └── environment.development.ts
│   └── styles/
│       ├── styles.scss
│       └── material-theme.scss
├── angular.json            # Angular workspace config
├── package.json           # Dependencies and scripts
├── tsconfig.json          # TypeScript config
├── Dockerfile             # Docker configuration
├── docker-compose.yml     # Docker Compose
└── nginx.conf             # Production server config
```

---

## Architecture Patterns

### 1. Standalone Components

All components are standalone (no NgModules):

```typescript
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard {
  // Component logic
}
```

**Benefits:**
- Smaller bundle sizes
- Faster compilation
- Better tree-shaking
- Simpler mental model

### 2. Signals-First Reactivity

State management using Angular signals:

```typescript
export class UsersComponent {
  // Signal for mutable state
  users = signal<User[]>([]);
  loading = signal(false);
  searchTerm = signal('');

  // Computed signal for derived state
  filteredUsers = computed(() => {
    const term = this.searchTerm().toLowerCase();
    return this.users().filter(u =>
      u.username.toLowerCase().includes(term)
    );
  });

  // Update signals
  loadUsers(): void {
    this.loading.set(true);
    this.userApi.getAll().subscribe(response => {
      this.users.set(response.data);
      this.loading.set(false);
    });
  }
}
```

**Benefits:**
- Fine-grained reactivity
- Better performance than Observables for local state
- Simpler than RxJS for simple cases
- Works great with OnPush change detection

### 3. Feature-Based Structure

Each feature is self-contained:

```
features/users/
├── models/
│   └── user.model.ts       # Type definitions
├── services/
│   └── user-api.service.ts # API calls
├── pages/
│   └── users/
│       ├── users.ts        # Main component
│       ├── users.html      # Template
│       └── users.scss      # Styles
└── enums/
    └── user-status.enum.ts # Enumerations
```

**Benefits:**
- Easy to find related code
- Can be extracted into libraries
- Clear boundaries
- Team collaboration friendly

### 4. Dependency Injection with `inject()`

Modern functional approach:

```typescript
export class MyComponent {
  // Old way (still works)
  // constructor(private myService: MyService) {}

  // New way (recommended)
  private myService = inject(MyService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
}
```

**Benefits:**
- Less boilerplate
- Can be used in functions
- Better tree-shaking
- Cleaner code

### 5. Lazy Loading

All routes are lazy loaded:

```typescript
export const routes: Routes = [
  {
    path: 'users',
    loadComponent: () => import('./features/users/pages/users/users')
      .then(m => m.UsersComponent)
  }
];
```

**Benefits:**
- Smaller initial bundle
- Faster initial load
- Load on demand
- Better code splitting

---

## Data Flow

### Request Flow

```
┌──────────┐
│ Component│
└────┬─────┘
     │ inject
     ▼
┌──────────────┐
│ API Service  │
└────┬─────────┘
     │ extends
     ▼
┌──────────────┐
│BaseApiService│
└────┬─────────┘
     │ uses
     ▼
┌──────────────┐
│  HttpClient  │
└────┬─────────┘
     │ through
     ▼
┌──────────────────────┐
│   Interceptors       │
│ 1. loggingInterceptor│
│ 2. authInterceptor   │
└────┬─────────────────┘
     │
     ▼
┌──────────────┐
│   Backend    │
└──────────────┘
```

### Authentication Flow

```
1. User submits login form
   └─> Component calls AuthService.login()

2. AuthService makes API call
   └─> POST /auth/login

3. Backend returns tokens
   └─> { accessToken, refreshToken, user }

4. AuthService stores tokens
   ├─> Access token → memory (default)
   └─> Refresh token → HTTP-only cookie

5. Future requests include token
   └─> authInterceptor adds Authorization header

6. Token refresh (automatic)
   ├─> 2 minutes before expiry
   ├─> POST /auth/refresh
   └─> Get new access token

7. Logout
   ├─> POST /auth/logout
   ├─> Clear tokens
   └─> Redirect to login
```

### Authorization Flow

```
1. User navigates to protected route
   └─> Route guard checks authentication

2. authGuard validates
   ├─> Check if user is authenticated
   └─> Allow or redirect to login

3. roleGuard validates (for admin routes)
   ├─> Check user roles
   └─> Allow or redirect to unauthorized

4. Component loads
   └─> Use *can directive for UI elements

5. Permission check
   └─> PermissionService.hasPermission()
```

---

## State Management

### Component-Level State (Signals)

For local component state:

```typescript
export class DashboardComponent {
  stats = signal({
    users: 0,
    sessions: 0,
    storage: '0 GB'
  });

  loading = signal(false);

  recentActivities = signal<Activity[]>([]);
}
```

### Service-Level State (BehaviorSubject)

For shared state across components (from ng-admin-core):

```typescript
@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
}
```

### When to Use What?

| Use Case | Solution |
|----------|----------|
| Local component state | Signals |
| Derived state | Computed signals |
| Shared state (simple) | Service with signals |
| Shared state (complex) | Service with BehaviorSubject |
| Async operations | Observables (RxJS) |
| Global app state | NgRx (if needed, not included) |

---

## Authentication & Authorization

### Architecture Overview

```
┌─────────────────────────────────────────┐
│         ng-admin-core Library           │
├─────────────────────────────────────────┤
│                                         │
│  ┌──────────────┐  ┌─────────────────┐│
│  │ AuthService  │  │PermissionService││
│  └──────┬───────┘  └────────┬────────┘│
│         │                   │         │
│  ┌──────▼──────────┐ ┌──────▼────────┐│
│  │ SessionService  │ │  TokenService ││
│  └─────────────────┘ └───────────────┘│
│                                         │
│  ┌──────────────────────────────────┐ │
│  │   Guards & Interceptors          │ │
│  │  - authGuard                     │ │
│  │  - guestGuard                    │ │
│  │  - roleGuard                     │ │
│  │  - authInterceptor               │ │
│  └──────────────────────────────────┘ │
│                                         │
│  ┌──────────────────────────────────┐ │
│  │   Directives                     │ │
│  │  - *can                          │ │
│  │  - *cannot                       │ │
│  └──────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

### Token Management

**Storage Options:**

1. **Memory** (default, most secure)
   ```typescript
   provideAuth({
     token: { storage: 'memory' }
   })
   ```
   - ✅ Most secure (XSS safe)
   - ❌ Lost on refresh
   - ✅ Recommended for high-security apps

2. **localStorage** (persistent)
   ```typescript
   provideAuth({
     token: { storage: 'localStorage' }
   })
   ```
   - ✅ Survives refresh
   - ❌ XSS vulnerable
   - ⚠️ Use with caution

3. **sessionStorage** (tab-scoped)
   ```typescript
   provideAuth({
     token: { storage: 'sessionStorage' }
   })
   ```
   - ✅ Tab-scoped
   - ⚠️ Moderate security
   - ✅ Good balance

### RBAC Implementation

**Role-Based:**
```typescript
// Route protection
{
  path: 'admin',
  canActivate: [roleGuard([RoleEnum.ADMIN])]
}

// Service check
this.permissionService.hasRole('admin')
```

**Permission-Based:**
```typescript
// Template
<button *can="'users:delete'">Delete</button>

// Service
this.permissionService.hasPermission('users:delete')
```

**Combined:**
```typescript
this.permissionService.can({
  roles: ['admin', 'moderator'],
  permissions: ['users:write'],
  requireAll: false // OR logic
})
```

---

## Routing Strategy

### Route Configuration

```typescript
// app.routes.ts (root)
export const routes: Routes = [
  // Public routes
  {
    path: 'auth',
    canActivate: [guestGuard], // Only for unauthenticated
    loadChildren: () => import('./features/auth/auth.routes')
  },

  // Protected routes
  {
    path: 'dashboard',
    canActivate: [authGuard], // Requires authentication
    loadComponent: () => import('./features/dashboard/pages/dashboard/dashboard')
  },

  // Admin routes
  {
    path: 'admin',
    canActivate: [authGuard, roleGuard([RoleEnum.ADMIN])],
    children: [
      {
        path: 'users',
        loadComponent: () => import('./features/users/pages/users/users')
      }
    ]
  },

  // Redirects
  { path: '', redirectTo: '/auth/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/auth/login' }
];
```

### Guard Execution Order

```
1. guestGuard (if present)
   └─> Allows only unauthenticated users

2. authGuard (if present)
   └─> Requires authentication

3. roleGuard (if present)
   └─> Requires specific roles

4. Component loads
```

---

## Library: ng-admin-core

### Purpose

Reusable authentication and authorization logic extracted into a library.

### Architecture

```
ng-admin-core/
├── src/
│   ├── lib/
│   │   ├── auth/          # Authentication
│   │   │   ├── services/
│   │   │   │   ├── auth.service.ts
│   │   │   │   └── session.service.ts
│   │   │   ├── guards/
│   │   │   │   ├── auth.guard.ts
│   │   │   │   ├── guest.guard.ts
│   │   │   │   └── role.guard.ts
│   │   │   └── interceptors/
│   │   │       └── auth.interceptor.ts
│   │   ├── authorization/ # Authorization
│   │   │   ├── services/
│   │   │   │   └── permission.service.ts
│   │   │   └── directives/
│   │   │       ├── can.directive.ts
│   │   │       └── cannot.directive.ts
│   │   ├── core/          # Core utilities
│   │   │   ├── services/
│   │   │   │   ├── base-api.service.ts
│   │   │   │   └── token.service.ts
│   │   │   └── models/
│   │   │       └── user.model.ts
│   │   └── schemas/       # Validation
│   │       └── validation-schemas.ts
│   └── public-api.ts      # Public exports
└── package.json
```

### Key Exports

```typescript
// Services
export { AuthService } from './lib/auth/services/auth.service';
export { PermissionService } from './lib/authorization/services/permission.service';
export { SessionService } from './lib/auth/services/session.service';
export { BaseApiService } from './lib/core/services/base-api.service';

// Guards
export { authGuard } from './lib/auth/guards/auth.guard';
export { guestGuard } from './lib/auth/guards/guest.guard';
export { roleGuard } from './lib/auth/guards/role.guard';

// Interceptors
export { authInterceptor } from './lib/auth/interceptors/auth.interceptor';

// Directives
export { CanDirective } from './lib/authorization/directives/can.directive';
export { CannotDirective } from './lib/authorization/directives/cannot.directive';

// Providers
export { provideAdminCore } from './lib/providers/admin-core.provider';
export { provideAuth } from './lib/providers/auth.provider';
```

### Usage in Application

```typescript
// app.config.ts
import { provideAdminCore, provideAuth } from '@labyrinth-team/ng-admin-core';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAdminCore({
      apiBaseUrl: environment.apiUrl
    }),
    provideAuth({
      token: { storage: 'memory' },
      session: {
        inactivityTimeout: 30 * 60 * 1000,
        refreshBeforeExpiry: 2 * 60 * 1000
      },
      routes: {
        afterLogin: '/dashboard',
        afterLogout: '/auth/login',
        unauthorized: '/auth/unauthorized'
      }
    })
  ]
};
```

---

## Performance Optimizations

### 1. Lazy Loading

**All routes lazy loaded:**
```typescript
loadComponent: () => import('./feature/component')
```

**Impact:**
- Initial bundle: ~500KB (with budget)
- Each feature loaded on demand
- Faster initial page load

### 2. OnPush Change Detection

**Recommended for all components:**
```typescript
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush
})
```

**Benefits:**
- Only checks when inputs change
- Works perfectly with signals
- Reduces unnecessary re-renders

### 3. TrackBy Functions

**For *ngFor loops:**
```typescript
@for (user of users(); track user.id) {
  <app-user-card [user]="user" />
}

// Or with function
trackById(index: number, item: User): number {
  return item.id;
}
```

### 4. Build Optimizations

**Production Build:**
```bash
npm run build:prod
```

Includes:
- Tree-shaking (unused code removed)
- Minification
- Compression
- Optimization
- Code splitting

**Bundle Budgets:**
```json
{
  "budgets": [
    {
      "type": "initial",
      "maximumWarning": "500kB",
      "maximumError": "1MB"
    }
  ]
}
```

### 5. Asset Optimization

**nginx.conf settings:**
- Gzip compression enabled
- Long-term caching for static assets
- Cache control headers

---

## Security Architecture

### Defense in Depth

**Layer 1: Network (nginx)**
- Security headers
- HTTPS/TLS
- Rate limiting (can be added)

**Layer 2: Application (Angular)**
- Input validation (Zod)
- XSS protection (built-in)
- CSRF tokens (backend)

**Layer 3: Authentication**
- JWT tokens
- Token refresh
- Session management

**Layer 4: Authorization**
- RBAC
- Permission checks
- Route guards

### Security Features

1. **Token Security**
   - Access token in memory (default)
   - Refresh token in HTTP-only cookie
   - Automatic refresh
   - Secure storage options

2. **Route Protection**
   - authGuard for authentication
   - roleGuard for authorization
   - guestGuard for public routes

3. **XSS Protection**
   - Angular's DomSanitizer
   - Content Security Policy
   - No innerHTML without sanitization

4. **Input Validation**
   - Zod schemas for all forms
   - Server-side validation (backend)
   - Type-safe models

---

## Best Practices

### Component Design

✅ **Do:**
- Keep components focused (single responsibility)
- Use signals for local state
- Use OnPush change detection
- Add trackBy to loops
- Extract complex logic to services

❌ **Don't:**
- Put business logic in components
- Mutate state directly
- Forget to unsubscribe from Observables
- Use `any` type

### Service Design

✅ **Do:**
- Use `providedIn: 'root'` for singletons
- Return Observables for async operations
- Handle errors properly
- Add JSDoc comments

❌ **Don't:**
- Store state in services (use BehaviorSubject)
- Make direct HTTP calls from components
- Expose internal implementation details

### Testing

✅ **Do:**
- Test business logic
- Test edge cases
- Test error scenarios
- Maintain >80% coverage

❌ **Don't:**
- Test implementation details
- Couple tests to DOM structure
- Ignore failing tests

---

## Diagrams

### Application Bootstrap

```
┌─────────────┐
│  main.ts    │
└──────┬──────┘
       │
       ▼
┌──────────────────┐
│ bootstrapApplication │
│   (AppComponent)     │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│   app.config.ts      │
│ - Load AppConfig     │
│ - Register providers │
│ - Setup interceptors │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│ APP_INITIALIZER      │
│ - Load runtime config│
│ - Initialize app     │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│  AppComponent loads  │
└──────────────────────┘
```

### Component Lifecycle (with Signals)

```
1. Constructor
   └─> Dependency injection

2. ngOnInit
   └─> Initialize signals
   └─> Load initial data

3. Template renders
   └─> Signals tracked
   └─> Computed values evaluated

4. User interaction
   └─> Signal updated
   └─> Template auto-updates

5. ngOnDestroy
   └─> Cleanup (if needed)
```

---

## Migration Guide

### From NgModules to Standalone

If you're familiar with NgModules:

**Before (NgModule):**
```typescript
@NgModule({
  declarations: [MyComponent],
  imports: [CommonModule, MatButtonModule],
  exports: [MyComponent]
})
export class MyModule {}
```

**After (Standalone):**
```typescript
@Component({
  standalone: true,
  imports: [CommonModule, MatButtonModule]
})
export class MyComponent {}
```

### From Observables to Signals

**Before (Observable):**
```typescript
count$ = new BehaviorSubject(0);
doubleCount$ = this.count$.pipe(map(n => n * 2));

increment() {
  this.count$.next(this.count$.value + 1);
}
```

**After (Signal):**
```typescript
count = signal(0);
doubleCount = computed(() => this.count() * 2);

increment() {
  this.count.update(n => n + 1);
}
```

---

## Further Reading

- [Angular Signals](https://angular.dev/guide/signals)
- [Standalone Components](https://angular.dev/guide/components/importing)
- [Angular Security](https://angular.dev/best-practices/security)
- [RxJS Documentation](https://rxjs.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

*Last updated: 2025-01-08*
