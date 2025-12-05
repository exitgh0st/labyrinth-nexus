# @labyrinth-team/ng-admin-core

A comprehensive Angular library providing authentication, authorization, and core administrative functionality for Angular applications.

## Features

- **Authentication** - Complete JWT-based authentication with login, register, logout, and OAuth support
- **Authorization** - Role-based (RBAC) and permission-based access control
- **Token Management** - Automatic token refresh, configurable storage, and session management
- **Route Guards** - Protect routes with authentication and permission requirements
- **HTTP Interceptors** - Automatic token injection and 401 error handling
- **Directives** - Conditional rendering based on user permissions
- **Session Management** - Inactivity timeout, cross-tab synchronization
- **Base Services** - Reusable API service base classes with CRUD operations
- **Base Components** - BaseListComponent for list pages with pagination and filtering
- **UI Components** - Common admin components (empty states, skeleton loaders)
- **Validation** - Zod-based form validation utilities and schemas
- **Utilities** - Dialog service, notification service, breakpoint service

## Installation

```bash
npm install @labyrinth-team/ng-admin-core
```

### Peer Dependencies

This library requires the following peer dependencies:

```json
{
  "@angular/animations": "^20.0.0",
  "@angular/cdk": "^20.0.0",
  "@angular/common": "^20.0.0",
  "@angular/core": "^20.0.0",
  "@angular/forms": "^20.0.0",
  "@angular/material": "^20.0.0",
  "@angular/router": "^20.0.0",
  "rxjs": "^7.8.0",
  "zod": "^4.0.0"
}
```

## Quick Start

### 1. Configure the Library

In your `app.config.ts`:

```typescript
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideAdminCore, provideAuth, authInterceptor } from '@labyrinth-team/ng-admin-core';
import { environment } from './environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    // Configure core settings
    provideAdminCore({
      apiBaseUrl: environment.apiUrl
    }),

    // Configure authentication
    provideAuth({
      token: {
        storage: 'memory', // 'localStorage', 'sessionStorage', or 'memory'
      },
      session: {
        inactivityTimeout: 30 * 60 * 1000, // 30 minutes
        refreshBeforeExpiry: 2 * 60 * 1000, // 2 minutes before token expires
        enableCrossTabSync: true,
      },
      routes: {
        afterLogin: '/dashboard',
        afterLogout: '/auth/login',
        unauthorized: '/unauthorized',
        login: '/auth/login',
      },
      http: {
        withCredentials: true, // For cookie-based refresh tokens
      }
    }),

    // Setup HTTP client with auth interceptor
    provideHttpClient(
      withFetch(),
      withInterceptors([authInterceptor])
    ),

    provideAnimations(),
    provideRouter(routes)
  ]
};
```

### 2. Initialize Authentication on App Startup

Create an app initializer service:

```typescript
// src/app/core/services/app-initializer.ts
import { inject, Injectable } from '@angular/core';
import { AuthService } from '@labyrinth-team/ng-admin-core';

@Injectable({
  providedIn: 'root',
})
export class AppInitializer {
  authService = inject(AuthService);

  async initialize(): Promise<void> {
    return this.authService.initialize();
  }
}
```

Add to your `app.config.ts`:

```typescript
import { provideAppInitializer } from '@angular/core';

export const appConfig: ApplicationConfig = {
  providers: [
    // ... other providers
    provideAppInitializer(() => {
      const appInitializer = inject(AppInitializer);
      return appInitializer.initialize();
    }),
  ]
};
```

### 3. Setup Routes with Guards

```typescript
// app.routes.ts
import { Routes } from '@angular/router';
import { authGuard, guestGuard, roleGuard } from '@labyrinth-team/ng-admin-core';

export const routes: Routes = [
  // Public routes (for unauthenticated users only)
  {
    path: 'auth',
    children: [
      {
        path: 'login',
        component: LoginComponent,
        canActivate: [guestGuard]
      },
      {
        path: 'register',
        component: RegisterComponent,
        canActivate: [guestGuard]
      }
    ]
  },

  // Protected routes (authentication required)
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard]
  },

  // Role-protected routes
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [authGuard, roleGuard(['admin'])],
  },

  // Permission-protected routes
  {
    path: 'users',
    component: UsersComponent,
    canActivate: [authGuard, roleGuard(undefined, ['users:manage'])],
  },

  // Multiple roles/permissions (OR logic)
  {
    path: 'reports',
    component: ReportsComponent,
    canActivate: [authGuard, roleGuard(['admin', 'manager'], ['reports:view'])],
  },

  // Multiple roles AND permissions (AND logic)
  {
    path: 'settings',
    component: SettingsComponent,
    canActivate: [authGuard, roleGuard(['admin'], ['settings:edit'], true)],
  },

  // Unauthorized page
  {
    path: 'unauthorized',
    component: UnauthorizedComponent
  },

  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: '/dashboard' }
];
```

## Authentication

### Login

```typescript
import { Component, inject } from '@angular/core';
import { AuthService } from '@labyrinth-team/ng-admin-core';

@Component({
  selector: 'app-login',
  template: `
    <form (ngSubmit)="onLogin()">
      <input [(ngModel)]="email" type="email" placeholder="Email" />
      <input [(ngModel)]="password" type="password" placeholder="Password" />
      <button type="submit" [disabled]="authService.loading()">
        @if (authService.loading()) {
          Logging in...
        } @else {
          Login
        }
      </button>
      @if (authService.authError()) {
        <p class="error">{{ authService.authError() }}</p>
      }
    </form>
  `
})
export class LoginComponent {
  authService = inject(AuthService);
  email = '';
  password = '';

  onLogin() {
    this.authService.login({
      email: this.email,
      password: this.password
    }).subscribe({
      next: () => {
        // Automatically redirected to afterLogin route
      },
      error: (err) => {
        console.error('Login failed:', err);
      }
    });
  }
}
```

### Register

```typescript
onRegister() {
  this.authService.register({
    email: this.email,
    password: this.password,
    confirmPassword: this.confirmPassword,
    firstName: this.firstName,
    lastName: this.lastName
  }).subscribe({
    next: () => {
      // Automatically redirected to afterLogin route
    }
  });
}
```

### Logout

```typescript
onLogout() {
  this.authService.logout().subscribe({
    next: () => {
      // Automatically redirected to afterLogout route
    }
  });
}
```

### OAuth Login

```typescript
loginWithGoogle() {
  const oauthUrl = this.authService.getOAuthUrl('google');
  window.location.href = oauthUrl;
}

// After OAuth redirect
ngOnInit() {
  this.authService.handleOAuthCallback().subscribe({
    next: () => {
      // Logged in successfully
    }
  });
}
```

### Access User Data

```typescript
@Component({
  template: `
    @if (authService.isAuthenticated()) {
      <p>Welcome, {{ authService.user()?.email }}</p>
      <p>Roles: {{ authService.user()?.roles?.map(r => r.name).join(', ') }}</p>
    }
  `
})
export class ProfileComponent {
  authService = inject(AuthService);
}
```

## Authorization

### Using Permission Service

```typescript
import { Component, inject } from '@angular/core';
import { PermissionService } from '@labyrinth-team/ng-admin-core';

@Component({
  selector: 'app-user-list',
})
export class UserListComponent {
  permissionService = inject(PermissionService);

  canEditUser(): boolean {
    return this.permissionService.hasPermission('users:edit');
  }

  canDeleteUser(): boolean {
    // User must have either admin role OR users:delete permission
    return this.permissionService.can({
      roles: ['admin'],
      permissions: ['users:delete']
    });
  }

  canManageUsers(): boolean {
    // User must have admin role AND users:manage permission
    return this.permissionService.can({
      roles: ['admin'],
      permissions: ['users:manage']
    }, { requireAll: true });
  }

  isAdmin(): boolean {
    return this.permissionService.isAdmin();
  }
}
```

### Using Directives for Conditional Rendering

```html
<!-- Show only if user has admin role -->
<button *can="{ roles: ['admin'] }">Delete All Users</button>

<!-- Show only if user has permission -->
<button *can="{ permissions: ['users:create'] }">Create User</button>

<!-- Show if user has admin OR moderator role -->
<nav *can="{ roles: ['admin', 'moderator'] }">
  <a routerLink="/admin">Admin Panel</a>
</nav>

<!-- Show if user has admin role AND users:delete permission -->
<button *can="{ roles: ['admin'], permissions: ['users:delete'], requireAll: true }">
  Delete User
</button>

<!-- Show alternative content if user doesn't have permission -->
<div *can="{ roles: ['admin'] }; else notAdmin">
  <h2>Admin Dashboard</h2>
</div>
<ng-template #notAdmin>
  <p>You don't have permission to view this</p>
</ng-template>

<!-- Inverse: Show only if user does NOT have admin role -->
<div *cannot="{ roles: ['admin'] }">
  <p>Regular user content</p>
</div>
```

## Guards

### Auth Guard

Protects routes that require authentication:

```typescript
{
  path: 'dashboard',
  component: DashboardComponent,
  canActivate: [authGuard]
}
```

### Guest Guard

Protects routes that should only be accessible to unauthenticated users:

```typescript
{
  path: 'login',
  component: LoginComponent,
  canActivate: [guestGuard] // Redirects to home if already logged in
}
```

### Role Guard

Protects routes based on roles and permissions:

```typescript
// User must have 'admin' role
{
  path: 'admin',
  component: AdminComponent,
  canActivate: [authGuard, roleGuard(['admin'])]
}

// User must have 'users:manage' permission
{
  path: 'users',
  component: UsersComponent,
  canActivate: [authGuard, roleGuard(undefined, ['users:manage'])]
}

// User must have admin OR manager role (OR logic)
{
  path: 'reports',
  component: ReportsComponent,
  canActivate: [authGuard, roleGuard(['admin', 'manager'])]
}

// User must have admin role AND settings:edit permission (AND logic)
{
  path: 'settings',
  component: SettingsComponent,
  canActivate: [authGuard, roleGuard(['admin'], ['settings:edit'], true)]
}
```

### Role Guard with Route Data

You can also pass requirements via route data:

```typescript
import { roleGuardWithData } from '@labyrinth-team/ng-admin-core';

{
  path: 'admin',
  component: AdminComponent,
  canActivate: [roleGuardWithData],
  data: {
    roles: ['admin'],
    permissions: ['admin:access'],
    requireAll: false // OR logic (default)
  }
}
```

## HTTP Interceptor

The `authInterceptor` automatically:
- Adds `Authorization` header to requests
- Handles 401 errors by refreshing the token
- Retries failed requests after token refresh

Already configured in your HTTP client setup.

## Base Components

### BaseListComponent

Extend `BaseListComponent` for list pages with automatic pagination, loading states, and CRUD operations:

```typescript
import { Component, inject } from '@angular/core';
import { BaseListComponent } from '@labyrinth-team/ng-admin-core';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.html',
})
export class UserList extends BaseListComponent<User, string> {
  protected override apiService = inject(UserApi);
  protected override baseRoute = 'admin/users';
  protected override itemName = 'user';

  displayedColumns = ['name', 'email', 'roles', 'status', 'actions'];
  pageSizeOptions = [5, 10, 25, 50];
}
```

#### Features Provided by BaseListComponent:

- **Pagination Signals**: Reactive `skip` and `take` signals
- **State Management**: `items`, `total`, `loading`, `error` signals
- **CRUD Methods**: `create()`, `edit()`, `view()`, `delete()`
- **Pagination Methods**: `nextPage()`, `previousPage()`, `goToPage()`, `changePageSize()`
- **Computed Properties**: `currentPage`, `totalPages`, `hasNextPage`, `hasPreviousPage`
- **Auto-loading**: Loads items on initialization

#### Template Example:

```html
<mat-table [dataSource]="items()">
  <!-- Your columns -->
</mat-table>

<mat-paginator
  [length]="total()"
  [pageSize]="take()"
  [pageIndex]="currentPage() - 1"
  [pageSizeOptions]="pageSizeOptions"
  (page)="onPageChange($event)"
/>
```

## API Services

### BaseApiService

Extend `BaseApiService` for your custom API services:

```typescript
import { Injectable } from '@angular/core';
import { BaseApiService } from '@labyrinth-team/ng-admin-core';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

@Injectable({ providedIn: 'root' })
export class UserApiService extends BaseApiService<User, string> {
  protected override endpoint = '/users';

  // Inherited methods:
  // - getAll(query?: ListQuery): Observable<ListResponse<User>>
  // - getById(id: string): Observable<User>
  // - create(data: Partial<User>): Observable<User>
  // - update(id: string, data: Partial<User>): Observable<User>
  // - delete(id: string): Observable<void>

  // Add custom methods
  activate(id: string): Observable<User> {
    return this.http.post<User>(`${this.getFullUrl()}/${id}/activate`, {});
  }
}
```

## Core Services

### Dialog Service

```typescript
import { inject } from '@angular/core';
import { DialogService } from '@labyrinth-team/ng-admin-core';

const dialogService = inject(DialogService);

// Confirmation dialog
const confirmed = await dialogService.confirm({
  title: 'Delete User?',
  text: 'This action cannot be undone.',
  icon: 'warning',
  confirmButtonText: 'Yes, delete',
  cancelButtonText: 'Cancel'
});

if (confirmed) {
  // Perform deletion
}
```

### Notification Service

```typescript
import { inject } from '@angular/core';
import { NotificationService } from '@labyrinth-team/ng-admin-core';

const notificationService = inject(NotificationService);

// Success notification
notificationService.success('User created successfully');

// Error notification
notificationService.error('Failed to create user');

// Info notification
notificationService.info('Processing your request');

// Warning notification
notificationService.warning('Please verify your email');
```

### Breakpoint Service

```typescript
import { inject } from '@angular/core';
import { BreakpointService } from '@labyrinth-team/ng-admin-core';

const breakpointService = inject(BreakpointService);

// Reactive signals for different breakpoints
isMobile = breakpointService.isMobile; // <= 768px
isTablet = breakpointService.isTablet; // 769px - 1024px
isDesktop = breakpointService.isDesktop; // >= 1025px
```

## UI Components

### Empty State

```html
<lb-empty-state
  icon="people"
  title="No users found"
  message="Get started by creating your first user"
  actionText="Create User"
  (action)="createUser()"
  size="medium"
/>
```

### Skeleton Loader

```html
<!-- Table skeleton -->
<lb-skeleton-loader [rows]="5" [columns]="4" type="table" />

<!-- Card skeleton -->
<lb-skeleton-loader type="card" />

<!-- List skeleton -->
<lb-skeleton-loader [rows]="3" type="list" />
```

## Configuration Reference

### Auth Configuration Options

```typescript
interface AuthConfig {
  // API endpoints
  endpoints: {
    login: string;           // Default: '/auth/login'
    register: string;        // Default: '/auth/register'
    logout: string;          // Default: '/auth/logout'
    refresh: string;         // Default: '/auth/refresh'
    me: string;              // Default: '/auth/me'
    oauth?: {
      google?: string;       // Default: '/auth/oauth/google'
      github?: string;       // Default: '/auth/oauth/github'
      facebook?: string;
    };
  };

  // Token storage
  token: {
    storage?: 'localStorage' | 'sessionStorage' | 'memory'; // Default: 'memory'
    accessTokenKey?: string;      // Default: 'access_token'
    refreshTokenKey?: string;     // Default: 'refresh_token'
    headerPrefix?: string;        // Default: 'Bearer'
  };

  // Session management
  session: {
    refreshBeforeExpiry?: number;    // Default: 2 minutes (in ms)
    inactivityTimeout?: number;      // Default: 30 minutes (in ms)
    enableCrossTabSync?: boolean;    // Default: true
  };

  // Routing
  routes: {
    afterLogin?: string;       // Default: '/'
    afterLogout?: string;      // Default: '/login'
    unauthorized?: string;     // Default: '/unauthorized'
    login?: string;            // Default: '/login'
  };

  // HTTP
  http: {
    withCredentials?: boolean;           // Default: true
    skipAuthEndpoints?: string[];        // Default: ['/auth/login', '/auth/register', '/auth/refresh']
  };
}
```

## Data Models

### AuthUser

```typescript
interface AuthUser {
  id: string;
  email: string;
  emailVerified: boolean;
  firstName?: string;
  lastName?: string;
  displayName?: string;
  avatarUrl?: string;
  isActive: boolean;
  roles?: Role[];
  permissions?: Permission[];
}
```

### Role

```typescript
interface Role {
  id: number;
  name: string;
  description?: string;
  permissions?: Permission[];
}
```

### Permission

```typescript
interface Permission {
  id: string | number;
  name: string;
  resource?: string;
  action?: string;
  description?: string;
}
```

## Best Practices

### 1. Token Storage

- Use `'memory'` for maximum security (tokens not persisted)
- Use `'sessionStorage'` for tab-specific sessions
- Use `'localStorage'` for persistent sessions across tabs

### 2. Refresh Tokens

- Store refresh tokens in httpOnly cookies (backend responsibility)
- Configure `withCredentials: true` to send cookies
- Access tokens auto-refresh before expiry

### 3. Route Protection

Always combine `authGuard` with `roleGuard`:

```typescript
{
  path: 'admin',
  canActivate: [authGuard, roleGuard(['admin'])]
}
```

### 4. Error Handling

```typescript
this.authService.login(credentials).subscribe({
  next: (response) => {
    // Success - automatically redirected
  },
  error: (err) => {
    // Handle specific errors
    if (err.status === 401) {
      this.errorMessage = 'Invalid credentials';
    } else if (err.status === 429) {
      this.errorMessage = 'Too many login attempts';
    }
  }
});
```

### 5. Permission Checks

Use the permission service for complex logic:

```typescript
// Check in code
if (this.permissionService.can({ roles: ['admin'], permissions: ['users:delete'] })) {
  this.showDeleteButton = true;
}

// Or use directives in templates
<button *can="{ roles: ['admin'], permissions: ['users:delete'] }">Delete</button>
```

## Advanced Features

### Session Management

The library automatically handles:
- **Token Refresh**: Refreshes tokens 2 minutes before expiry
- **Inactivity Timeout**: Logs user out after 30 minutes of inactivity
- **Cross-Tab Sync**: Syncs logout across all browser tabs
- **Activity Tracking**: Monitors mouse, keyboard, scroll, touch events

### Manual Session Control

```typescript
// Record activity manually
authService.recordActivity();

// Hard reset (clear everything)
authService.reset();

// Update user data
authService.updateUser({ firstName: 'John', lastName: 'Doe' });
```

## Building the Library

To build the library for distribution:

```bash
ng build ng-admin-core
```

Build artifacts will be in the `dist/ng-admin-core` directory.

## Publishing

1. Build the library:
   ```bash
   ng build ng-admin-core
   ```

2. Navigate to dist directory:
   ```bash
   cd dist/ng-admin-core
   ```

3. Publish to npm:
   ```bash
   npm publish --access public
   ```

## Running Tests

Execute unit tests:

```bash
ng test ng-admin-core
```

## Version

Current version: 1.0.0

## License

MIT

---

Built with ❤️ by the Labyrinth Team
