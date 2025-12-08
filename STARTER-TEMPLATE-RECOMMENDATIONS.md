# Starter Template Recommendations: Labyrinth Nexus

## Executive Summary

**Overall Assessment: 70% Template-Ready**

Your codebase is a **production-grade Angular 20 application** with excellent architecture and modern patterns. It's a strong foundation for a starter template with minor cleanup and enhancements needed.

### Strengths
- ✅ Modern Angular 20 patterns (signals, standalone components)
- ✅ Excellent feature-based architecture
- ✅ Comprehensive authentication & authorization system
- ✅ Strong TypeScript with strict mode enabled
- ✅ Well-documented with comprehensive README
- ✅ Professional library integration

### Priority Actions
1. Add ESLint configuration and pre-commit hooks
2. Remove/parameterize hardcoded values
3. Add environment variable support
4. Create CI/CD configuration
5. Enhance error handling and testing
6. Add missing documentation files

---

## Table of Contents
1. [Critical Issues (Must Fix)](#1-critical-issues-must-fix)
2. [High Priority Improvements](#2-high-priority-improvements)
3. [Code Quality Enhancements](#3-code-quality-enhancements)
4. [Documentation Improvements](#4-documentation-improvements)
5. [Testing Enhancements](#5-testing-enhancements)
6. [Security Hardening](#6-security-hardening)
7. [Developer Experience](#7-developer-experience)
8. [Template-Specific Changes](#8-template-specific-changes)
9. [Architecture Review](#9-architecture-review)
10. [Implementation Roadmap](#10-implementation-roadmap)

---

## 1. Critical Issues (Must Fix)

### 1.1 Add ESLint Configuration
**Status**: ⚠️ MISSING
**Impact**: HIGH
**Effort**: LOW

**Current State**: No linting configured beyond EditorConfig

**Required Files**:
```json
// .eslintrc.json
{
  "root": true,
  "ignorePatterns": ["projects/**/*", "dist/**/*", "node_modules/**/*"],
  "overrides": [
    {
      "files": ["*.ts"],
      "extends": [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:@angular-eslint/recommended",
        "plugin:@angular-eslint/template/process-inline-templates"
      ],
      "rules": {
        "@angular-eslint/directive-selector": [
          "error",
          { "type": "attribute", "prefix": "app", "style": "camelCase" }
        ],
        "@angular-eslint/component-selector": [
          "error",
          { "type": "element", "prefix": "app", "style": "kebab-case" }
        ],
        "@typescript-eslint/no-explicit-any": "warn",
        "@typescript-eslint/explicit-function-return-type": "off"
      }
    },
    {
      "files": ["*.html"],
      "extends": [
        "plugin:@angular-eslint/template/recommended",
        "plugin:@angular-eslint/template/accessibility"
      ]
    }
  ]
}
```

**package.json updates**:
```json
{
  "devDependencies": {
    "@angular-eslint/builder": "^20.0.0",
    "@angular-eslint/eslint-plugin": "^20.0.0",
    "@angular-eslint/eslint-plugin-template": "^20.0.0",
    "@angular-eslint/schematics": "^20.0.0",
    "@angular-eslint/template-parser": "^20.0.0",
    "@typescript-eslint/eslint-plugin": "^8.0.0",
    "@typescript-eslint/parser": "^8.0.0",
    "eslint": "^9.0.0"
  },
  "scripts": {
    "lint": "ng lint",
    "lint:fix": "ng lint --fix"
  }
}
```

### 1.2 Environment Variable Support
**Status**: ⚠️ CRITICAL
**Impact**: HIGH
**Effort**: MEDIUM

**Problem**: API URLs hardcoded in environment files

**Current** (environment.ts, environment.development.ts):
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api' // ❌ Hardcoded
};
```

**Solution 1: Runtime Configuration (Recommended)**

Create `src/assets/config/app-config.json`:
```json
{
  "apiUrl": "http://localhost:3000/api",
  "appName": "Labyrinth Nexus",
  "sessionTimeout": 1800000
}
```

Create `src/app/core/services/app-config.service.ts`:
```typescript
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

export interface AppConfig {
  apiUrl: string;
  appName: string;
  sessionTimeout: number;
}

@Injectable({ providedIn: 'root' })
export class AppConfigService {
  private http = inject(HttpClient);
  private config!: AppConfig;

  async loadConfig(): Promise<void> {
    this.config = await firstValueFrom(
      this.http.get<AppConfig>('/assets/config/app-config.json')
    );
  }

  get apiUrl(): string {
    return this.config.apiUrl;
  }

  get appName(): string {
    return this.config.appName;
  }

  get sessionTimeout(): number {
    return this.config.sessionTimeout;
  }
}
```

Add to `app.config.ts`:
```typescript
export function initializeApp(configService: AppConfigService) {
  return () => configService.loadConfig();
}

export const appConfig: ApplicationConfig = {
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [AppConfigService],
      multi: true
    },
    // ... rest of config
  ]
};
```

**Solution 2: Docker Environment Variables**

Create `docker-entrypoint.sh`:
```bash
#!/bin/sh
# Replace environment variables in config file
envsubst < /usr/share/nginx/html/assets/config/app-config.template.json \
  > /usr/share/nginx/html/assets/config/app-config.json

exec "$@"
```

### 1.3 Package Version
**Status**: 🟡 PLACEHOLDER
**Impact**: MEDIUM
**Effort**: LOW

**File**: `package.json:2`

**Change**:
```json
{
  "name": "labyrinth-nexus",
  "version": "1.0.0", // ✅ Use semantic versioning
  "description": "Angular 20 Admin Starter Template with Authentication & Authorization"
}
```

### 1.4 Pre-commit Hooks
**Status**: ⚠️ MISSING
**Impact**: HIGH
**Effort**: LOW

**Install Dependencies**:
```bash
npm install --save-dev husky lint-staged @commitlint/cli @commitlint/config-conventional
```

**Setup Files**:

`.husky/pre-commit`:
```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

npx lint-staged
```

`.husky/commit-msg`:
```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

npx --no -- commitlint --edit "$1"
```

`commitlint.config.js`:
```javascript
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      ['feat', 'fix', 'docs', 'style', 'refactor', 'test', 'chore', 'perf', 'ci', 'build', 'revert']
    ]
  }
};
```

`package.json`:
```json
{
  "scripts": {
    "prepare": "husky install"
  },
  "lint-staged": {
    "*.ts": ["eslint --fix", "prettier --write"],
    "*.html": ["prettier --write"],
    "*.scss": ["prettier --write"]
  }
}
```

---

## 2. High Priority Improvements

### 2.1 CI/CD Configuration
**Status**: ⚠️ MISSING
**Impact**: HIGH
**Effort**: MEDIUM

**Create**: `.github/workflows/ci.yml`

```yaml
name: CI

on:
  push:
    branches: [ master, develop ]
  pull_request:
    branches: [ master, develop ]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run lint

  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm test -- --watch=false --browsers=ChromeHeadless
      - run: npm run test:coverage
      - uses: codecov/codecov-action@v4
        if: always()

  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run build -- --configuration production
      - uses: actions/upload-artifact@v4
        with:
          name: dist
          path: dist/
          retention-days: 7

  build-library:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: ng build ng-admin-core --configuration production
```

### 2.2 Error Boundary & Global Error Handler
**Status**: 🟡 BASIC
**Impact**: HIGH
**Effort**: MEDIUM

**Create**: `src/app/core/services/global-error-handler.service.ts`

```typescript
import { ErrorHandler, Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  private snackBar = inject(MatSnackBar);
  private router = inject(Router);

  handleError(error: Error): void {
    console.error('Global error caught:', error);

    // Log to external service (Sentry, LogRocket, etc.)
    // this.errorLogger.logError(error);

    // Display user-friendly message
    let message = 'An unexpected error occurred.';

    if (error.message) {
      message = error.message;
    }

    this.snackBar.open(message, 'Close', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['error-snackbar']
    });

    // Redirect to error page for critical errors
    if (this.isCriticalError(error)) {
      this.router.navigate(['/error']);
    }
  }

  private isCriticalError(error: Error): boolean {
    // Define critical error patterns
    return error.name === 'ChunkLoadError' ||
           error.message.includes('network');
  }
}
```

**Register** in `app.config.ts`:
```typescript
import { ErrorHandler } from '@angular/core';
import { GlobalErrorHandler } from './core/services/global-error-handler.service';

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
    // ... rest of config
  ]
};
```

**Create Error Page**: `src/app/core/pages/error/error.component.ts`

### 2.3 Loading States & Skeletons
**Status**: 🟡 PARTIAL
**Impact**: MEDIUM
**Effort**: MEDIUM

**Create**: `src/app/shared/components/skeleton/skeleton.component.ts`

```typescript
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-skeleton',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="skeleton" [ngClass]="variant" [ngStyle]="style">
      <div class="skeleton-animation"></div>
    </div>
  `,
  styles: [`
    .skeleton {
      position: relative;
      overflow: hidden;
      background-color: #e0e0e0;
      border-radius: 4px;

      &.text { height: 16px; margin: 8px 0; }
      &.title { height: 24px; margin: 12px 0; }
      &.circular { border-radius: 50%; }
      &.rectangular { border-radius: 4px; }
    }

    .skeleton-animation {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(
        90deg,
        transparent,
        rgba(255, 255, 255, 0.5),
        transparent
      );
      animation: shimmer 1.5s infinite;
    }

    @keyframes shimmer {
      0% { transform: translateX(-100%); }
      100% { transform: translateX(100%); }
    }
  `]
})
export class SkeletonComponent {
  @Input() variant: 'text' | 'title' | 'circular' | 'rectangular' = 'text';
  @Input() width?: string;
  @Input() height?: string;

  get style() {
    return {
      width: this.width || '100%',
      height: this.height || 'auto'
    };
  }
}
```

**Usage in Components**:
```typescript
@if (loading()) {
  <app-skeleton variant="title" width="200px" />
  <app-skeleton variant="text" />
  <app-skeleton variant="text" width="80%" />
} @else {
  <!-- Actual content -->
}
```

### 2.4 Request Logging Interceptor
**Status**: ⚠️ MISSING
**Impact**: MEDIUM
**Effort**: LOW

**Create**: `src/app/core/interceptors/logging.interceptor.ts`

```typescript
import { HttpInterceptorFn } from '@angular/core';
import { tap, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

export const loggingInterceptor: HttpInterceptorFn = (req, next) => {
  const startTime = Date.now();

  console.log(`[HTTP] ${req.method} ${req.url}`, {
    headers: req.headers.keys(),
    body: req.body
  });

  return next(req).pipe(
    tap(response => {
      const duration = Date.now() - startTime;
      console.log(`[HTTP] ${req.method} ${req.url} - ${duration}ms`, response);
    }),
    catchError(error => {
      const duration = Date.now() - startTime;
      console.error(`[HTTP] ${req.method} ${req.url} - ${duration}ms - ERROR`, error);
      return throwError(() => error);
    })
  );
};
```

**Add to** `app.config.ts`:
```typescript
import { loggingInterceptor } from './core/interceptors/logging.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(
      withFetch(),
      withInterceptors([loggingInterceptor]), // Add this
    ),
  ]
};
```

### 2.5 Docker Configuration
**Status**: ⚠️ MISSING
**Impact**: MEDIUM
**Effort**: LOW

**Create**: `Dockerfile`

```dockerfile
# Build stage
FROM node:20-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build -- --configuration production

# Production stage
FROM nginx:alpine

# Copy custom nginx config
COPY nginx.conf /etc/nginx/nginx.conf

# Copy built app
COPY --from=build /app/dist/labyrinth-nexus/browser /usr/share/nginx/html

# Copy config template
COPY src/assets/config/app-config.template.json /usr/share/nginx/html/assets/config/

# Copy entrypoint script
COPY docker-entrypoint.sh /
RUN chmod +x /docker-entrypoint.sh

EXPOSE 80

ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
```

**Create**: `nginx.conf`

```nginx
worker_processes auto;

events {
  worker_connections 1024;
}

http {
  include /etc/nginx/mime.types;
  default_type application/octet-stream;

  sendfile on;
  keepalive_timeout 65;
  gzip on;
  gzip_vary on;
  gzip_types text/plain text/css application/json application/javascript text/xml application/xml;

  server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    location / {
      try_files $uri $uri/ /index.html;
    }

    location /assets/ {
      expires 1y;
      add_header Cache-Control "public, immutable";
    }

    location ~* \.(js|css)$ {
      expires 1y;
      add_header Cache-Control "public, immutable";
    }
  }
}
```

**Create**: `.dockerignore`

```
node_modules
dist
.angular
.git
.husky
*.md
.editorconfig
.prettierrc.json
```

**Create**: `docker-compose.yml`

```yaml
version: '3.8'

services:
  frontend:
    build: .
    ports:
      - "80:80"
    environment:
      - API_URL=http://localhost:3000/api
      - APP_NAME=Labyrinth Nexus
      - SESSION_TIMEOUT=1800000
    restart: unless-stopped
```

---

## 3. Code Quality Enhancements

### 3.1 Add TrackBy Functions
**Impact**: MEDIUM (Performance)
**Effort**: LOW

**Problem**: Missing `trackBy` in `*ngFor` loops affects performance

**Files to Update**:
- `src/app/features/users/pages/users/users.ts:104`
- `src/app/features/roles/pages/roles/roles.ts:97`
- `src/app/features/session/pages/sessions/sessions.ts:107`
- `src/app/features/session/pages/admin-sessions/admin-sessions.ts:121`

**Example Fix** (users.ts):
```typescript
export class UsersComponent {
  // Add trackBy function
  trackById(index: number, item: User): number {
    return item.id;
  }
}
```

**Template**:
```html
@for (user of filteredUsers(); track trackById($index, user)) {
  <!-- ... -->
}
```

**Or with Angular 17+ syntax**:
```html
@for (user of filteredUsers(); track user.id) {
  <!-- ... -->
}
```

### 3.2 Implement OnPush Change Detection
**Impact**: HIGH (Performance)
**Effort**: MEDIUM

**Add to All Components**:
```typescript
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-users',
  changeDetection: ChangeDetectionStrategy.OnPush, // ✅ Add this
  // ...
})
export class UsersComponent {
  // Already using signals - perfect for OnPush!
}
```

**Benefits**:
- Faster change detection
- Works perfectly with signals
- Reduces unnecessary re-renders

### 3.3 Subscription Management
**Impact**: MEDIUM
**Effort**: LOW

**Create**: `src/app/shared/utils/destroy.ts`

```typescript
import { DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MonoTypeOperatorFunction } from 'rxjs';

export function takeUntilDestroy<T>(): MonoTypeOperatorFunction<T> {
  const destroyRef = inject(DestroyRef);
  return takeUntilDestroyed(destroyRef);
}
```

**Usage**:
```typescript
export class MyComponent {
  ngOnInit() {
    this.apiService.getData()
      .pipe(takeUntilDestroy()) // ✅ Auto-cleanup
      .subscribe(data => {
        // Handle data
      });
  }
}
```

### 3.4 Accessibility Improvements
**Impact**: HIGH
**Effort**: MEDIUM

**Add ARIA Labels** (Example from users.ts:104-106):
```html
<button
  mat-icon-button
  [matMenuTriggerFor]="menu"
  [attr.aria-label]="'Actions for ' + user.username"
  [attr.aria-expanded]="menuOpen">
  <mat-icon>more_vert</mat-icon>
</button>
```

**Add Skip Navigation**:
```html
<!-- Add to app.component.html -->
<a href="#main-content" class="skip-link">Skip to main content</a>

<main id="main-content">
  <!-- Your content -->
</main>
```

**Form Labels**:
```html
<!-- Ensure all inputs have labels -->
<mat-form-field>
  <mat-label>Username</mat-label>
  <input matInput formControlName="username" aria-required="true" />
</mat-form-field>
```

### 3.5 Lazy Load Material Modules
**Impact**: MEDIUM
**Effort**: LOW

**Current** (app.config.ts): All Material components imported at root level

**Recommendation**: Import Material components in feature modules only where needed

**Example** (users module):
```typescript
// users.routes.ts
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';

export const USERS_ROUTES: Routes = [
  {
    path: '',
    component: UsersComponent,
    imports: [MatTableModule, MatPaginatorModule] // Feature-specific
  }
];
```

---

## 4. Documentation Improvements

### 4.1 Add CONTRIBUTING.md
**Status**: ⚠️ MISSING
**Impact**: MEDIUM
**Effort**: LOW

**Create**: `CONTRIBUTING.md`

```markdown
# Contributing to Labyrinth Nexus

## Development Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Start development server: `npm start`
4. Open http://localhost:4200

## Code Standards

### Commit Messages
Follow [Conventional Commits](https://www.conventionalcommits.org/):
- `feat:` New features
- `fix:` Bug fixes
- `docs:` Documentation changes
- `style:` Code style changes (formatting)
- `refactor:` Code refactoring
- `test:` Adding tests
- `chore:` Build process or auxiliary tool changes

### TypeScript
- Use strict mode
- Avoid `any` type
- Use signals for reactive state
- Use `inject()` for dependency injection

### Angular
- Use standalone components
- Implement lazy loading for routes
- Use OnPush change detection
- Add trackBy to all *ngFor loops

### Testing
- Write unit tests for all services
- Component tests for complex logic
- Minimum 80% code coverage

## Pull Request Process

1. Create feature branch: `git checkout -b feat/my-feature`
2. Make changes and commit with conventional commits
3. Run tests: `npm test`
4. Run linter: `npm run lint`
5. Push and create PR
6. Wait for CI checks to pass
7. Request review

## Code Review Guidelines

- Keep PRs focused and small
- Update tests
- Update documentation
- Add screenshots for UI changes
```

### 4.2 Add SECURITY.md
**Status**: ⚠️ MISSING
**Impact**: HIGH
**Effort**: LOW

**Create**: `SECURITY.md`

```markdown
# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |

## Reporting a Vulnerability

**DO NOT** create a public GitHub issue for security vulnerabilities.

Please report security vulnerabilities by emailing: [your-security-email@example.com]

Include:
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

We will respond within 48 hours.

## Security Features

### Authentication
- JWT-based authentication
- Refresh token rotation
- Memory storage for tokens (default)
- Session timeout (30 minutes default)
- Cross-tab logout synchronization

### Authorization
- Role-based access control (RBAC)
- Permission-based UI rendering
- Route guards for protected pages

### HTTP Security
- HTTP-only cookies for refresh tokens
- CORS with credentials support
- CSRF protection (backend required)

### Best Practices
- No sensitive data in localStorage
- Input validation with Zod schemas
- XSS protection via Angular sanitization
- Strict TypeScript mode

## Configuration

### Secure Defaults
```typescript
// app.config.ts
provideNgAdminCore({
  tokenStorageType: 'memory', // Most secure
  inactivityTimeout: 30 * 60 * 1000, // 30 minutes
  refreshBeforeExpiry: 2 * 60 * 1000 // 2 minutes
})
```

### Environment Variables
Never commit:
- `.env` files
- `environment.*.ts` with real API keys
- Any credentials

Use `.env.example` for template.
```

### 4.3 Add ARCHITECTURE.md
**Status**: ⚠️ MISSING
**Impact**: MEDIUM
**Effort**: MEDIUM

**Create**: `docs/ARCHITECTURE.md`

```markdown
# Architecture Documentation

## Overview
Labyrinth Nexus is an Angular 20 admin starter template with authentication, authorization, and user management.

## Tech Stack
- **Framework**: Angular 20
- **Language**: TypeScript 5.7
- **UI**: Angular Material 20
- **Validation**: Zod
- **State Management**: Angular Signals
- **HTTP**: Angular HttpClient with Fetch API
- **Authentication**: JWT (via @labyrinth-team/ng-admin-core)

## Architecture Patterns

### Standalone Components
All components are standalone (no NgModules):
```typescript
@Component({
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  // ...
})
```

### Signals-First Reactivity
State management using Angular signals:
```typescript
users = signal<User[]>([]);
filteredUsers = computed(() => this.users().filter(/* ... */));
```

### Feature-Based Structure
```
src/app/
├── core/           # Singleton services, guards, interceptors
├── features/       # Feature modules
│   ├── auth/       # Authentication pages
│   ├── users/      # User management
│   └── ...
└── shared/         # Shared utilities, components, schemas
```

### Lazy Loading
All feature routes are lazy loaded:
```typescript
{
  path: 'users',
  loadComponent: () => import('./features/users/pages/users/users')
}
```

### Dependency Injection
Modern `inject()` function pattern:
```typescript
export class MyComponent {
  private userApi = inject(UserApi);
  private authService = inject(AuthService);
}
```

## Data Flow

### Authentication Flow
1. User submits login form
2. `AuthService.login()` calls backend API
3. Backend returns access + refresh tokens
4. Tokens stored (memory/localStorage/sessionStorage)
5. Auth interceptor adds token to requests
6. Auto-refresh before token expiry

### Authorization Flow
1. User authenticated
2. `PermissionService` checks user roles/permissions
3. Route guards validate access
4. UI elements conditionally rendered with `*can` directive

### API Communication
```
Component → API Service → BaseApiService → HttpClient → Backend
                                             ↓
                                    Auth Interceptor
                                    (adds token)
```

## Security Architecture

### Token Storage Strategy
- **Memory** (default): Most secure, lost on refresh
- **localStorage**: Persistent, XSS vulnerable
- **sessionStorage**: Tab-scoped, moderate security

### Route Protection
```typescript
// Public
{ path: 'login', canActivate: [guestGuard] }

// Authenticated
{ path: 'dashboard', canActivate: [authGuard] }

// Role-based
{ path: 'admin', canActivate: [roleGuard([RoleEnum.ADMIN])] }
```

## Library: @labyrinth-team/ng-admin-core

### Purpose
Reusable authentication & authorization logic

### Exports
- Services: AuthService, PermissionService, SessionService
- Guards: authGuard, guestGuard, roleGuard
- Interceptors: authInterceptor
- Directives: CanDirective, CannotDirective
- Components: Base components
- Schemas: Validation schemas

## State Management

### Component State
Local state with signals:
```typescript
loading = signal(false);
error = signal<string | null>(null);
data = signal<T[]>([]);
```

### Global State
Services with BehaviorSubject (from library):
```typescript
// AuthService
currentUser$: BehaviorSubject<User | null>
isAuthenticated$: Observable<boolean>
```

## Performance Optimizations

### Implemented
- Lazy loading routes
- Standalone components (smaller bundles)
- Signals (efficient reactivity)
- HTTP fetch API
- Build budgets (500KB initial)

### Recommended
- OnPush change detection
- TrackBy in *ngFor
- Virtual scrolling for large lists
- Image lazy loading
```

### 4.4 Add API Integration Guide
**Status**: ⚠️ MISSING
**Impact**: HIGH
**Effort**: LOW

**Create**: `docs/API-INTEGRATION.md`

```markdown
# API Integration Guide

## Overview
This template expects a REST API backend. All endpoints use the base URL from `environment.apiUrl`.

## Required Endpoints

### Authentication

#### POST /auth/login
**Request**:
```json
{
  "username": "string",
  "password": "string"
}
```

**Response** (200):
```json
{
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "roles": ["ADMIN"],
    "permissions": ["users:read", "users:write"]
  },
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc..."
}
```

#### POST /auth/register
**Request**:
```json
{
  "username": "string",
  "email": "string",
  "password": "string"
}
```

**Response** (201): Same as login

#### POST /auth/refresh
**Headers**: `Cookie: refreshToken=...`

**Response** (200):
```json
{
  "accessToken": "eyJhbGc..."
}
```

#### POST /auth/logout
**Headers**: `Authorization: Bearer <token>`

**Response** (204): No content

### Users

#### GET /users
**Headers**: `Authorization: Bearer <token>`

**Query Parameters**:
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 10)
- `search` (string): Search query

**Response** (200):
```json
{
  "data": [
    {
      "id": 1,
      "username": "john_doe",
      "email": "john@example.com",
      "roles": ["USER"],
      "isActive": true,
      "createdAt": "2025-01-01T00:00:00Z",
      "updatedAt": "2025-01-01T00:00:00Z"
    }
  ],
  "meta": {
    "total": 100,
    "page": 1,
    "limit": 10,
    "totalPages": 10
  }
}
```

#### POST /users
**Headers**: `Authorization: Bearer <token>`

**Request**:
```json
{
  "username": "string",
  "email": "string",
  "password": "string",
  "roles": ["USER"]
}
```

**Response** (201):
```json
{
  "id": 1,
  "username": "john_doe",
  "email": "john@example.com",
  "roles": ["USER"],
  "isActive": true,
  "createdAt": "2025-01-01T00:00:00Z",
  "updatedAt": "2025-01-01T00:00:00Z"
}
```

#### PUT /users/:id
**Headers**: `Authorization: Bearer <token>`

**Request**: Same as POST (all fields optional)

**Response** (200): Updated user object

#### DELETE /users/:id
**Headers**: `Authorization: Bearer <token>`

**Response** (204): No content

### Roles
Similar structure to Users endpoints (/roles, /roles/:id)

### Sessions
#### GET /sessions
**Headers**: `Authorization: Bearer <token>`

**Response** (200):
```json
{
  "data": [
    {
      "id": "session-uuid",
      "userId": 1,
      "username": "john_doe",
      "ipAddress": "192.168.1.1",
      "userAgent": "Mozilla/5.0...",
      "createdAt": "2025-01-01T00:00:00Z",
      "expiresAt": "2025-01-01T01:00:00Z",
      "isActive": true
    }
  ]
}
```

#### DELETE /sessions/:id
**Headers**: `Authorization: Bearer <token>`

**Response** (204): No content

## Error Responses

All errors follow this format:
```json
{
  "error": {
    "message": "Human-readable error message",
    "code": "ERROR_CODE",
    "details": {} // Optional additional details
  }
}
```

**Status Codes**:
- 400: Bad Request (validation errors)
- 401: Unauthorized (invalid/missing token)
- 403: Forbidden (insufficient permissions)
- 404: Not Found
- 409: Conflict (duplicate resource)
- 500: Internal Server Error

## Authentication Flow

1. **Login**:
   - POST /auth/login
   - Receive access + refresh tokens
   - Access token sent in `Authorization` header
   - Refresh token sent as HTTP-only cookie

2. **API Requests**:
   - Include `Authorization: Bearer <accessToken>` header
   - Include cookies (withCredentials: true)

3. **Token Refresh**:
   - When access token expires (or 2 minutes before)
   - POST /auth/refresh with refresh token cookie
   - Receive new access token
   - Update token in memory

4. **Logout**:
   - POST /auth/logout
   - Clear tokens on frontend
   - Invalidate refresh token on backend

## CORS Configuration

Backend must allow:
```javascript
// Express.js example
app.use(cors({
  origin: 'http://localhost:4200', // Your frontend URL
  credentials: true, // Allow cookies
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

## Sample Backend (Node.js/Express)

See `/docs/sample-backend.js` for a minimal working backend implementation.
```

### 4.5 Update README.md
**Status**: 🟡 GOOD, NEEDS MINOR UPDATES
**Impact**: LOW
**Effort**: LOW

**Changes Needed**:

1. Add license (line 406):
```markdown
## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
```

2. Create `LICENSE` file:
```
MIT License

Copyright (c) 2025 [Your Name/Organization]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

3. Add badges:
```markdown
# Labyrinth Nexus

![Angular](https://img.shields.io/badge/Angular-20-red)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Build](https://github.com/your-username/labyrinth-nexus/workflows/CI/badge.svg)
```

4. Add "Quick Start" section at the top:
```markdown
## Quick Start

```bash
# Clone the repository
git clone https://github.com/your-username/labyrinth-nexus.git

# Install dependencies
cd labyrinth-nexus
npm install

# Configure environment
cp src/assets/config/app-config.example.json src/assets/config/app-config.json
# Edit app-config.json with your API URL

# Start development server
npm start
```

Navigate to `http://localhost:4200`

**Default credentials**: See backend setup docs
```

---

## 5. Testing Enhancements

### 5.1 Add Test Coverage Reporting
**Status**: ⚠️ MISSING
**Impact**: MEDIUM
**Effort**: LOW

**Update**: `karma.conf.js`

```javascript
module.exports = function (config) {
  config.set({
    // ... existing config
    coverageReporter: {
      dir: require('path').join(__dirname, './coverage'),
      subdir: '.',
      reporters: [
        { type: 'html' },
        { type: 'text-summary' },
        { type: 'lcovonly' }
      ],
      check: {
        global: {
          statements: 80,
          branches: 80,
          functions: 80,
          lines: 80
        }
      }
    }
  });
};
```

**Update**: `package.json`

```json
{
  "scripts": {
    "test": "ng test",
    "test:coverage": "ng test --no-watch --code-coverage",
    "test:ci": "ng test --no-watch --code-coverage --browsers=ChromeHeadless"
  }
}
```

### 5.2 Add E2E Testing
**Status**: ⚠️ MISSING
**Impact**: HIGH
**Effort**: HIGH

**Install Playwright**:
```bash
npm install --save-dev @playwright/test
npx playwright install
```

**Create**: `playwright.config.ts`

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:4200',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
  ],
  webServer: {
    command: 'npm start',
    url: 'http://localhost:4200',
    reuseExistingServer: !process.env.CI,
  },
});
```

**Create**: `e2e/auth.spec.ts`

```typescript
import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('should login successfully', async ({ page }) => {
    await page.goto('/auth/login');

    await page.fill('input[formControlName="username"]', 'admin');
    await page.fill('input[formControlName="password"]', 'password123');
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL('/dashboard');
    await expect(page.locator('h1')).toContainText('Dashboard');
  });

  test('should show error on invalid credentials', async ({ page }) => {
    await page.goto('/auth/login');

    await page.fill('input[formControlName="username"]', 'invalid');
    await page.fill('input[formControlName="password"]', 'wrong');
    await page.click('button[type="submit"]');

    await expect(page.locator('.error-message')).toBeVisible();
  });
});
```

**Update**: `package.json`

```json
{
  "scripts": {
    "e2e": "playwright test",
    "e2e:ui": "playwright test --ui",
    "e2e:headed": "playwright test --headed"
  }
}
```

### 5.3 Improve Unit Test Examples
**Impact**: MEDIUM
**Effort**: MEDIUM

**Example Service Test**: `src/app/features/users/services/user-api.service.spec.ts`

```typescript
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UserApi } from './user-api.service';
import { environment } from '../../../../environments/environment';

describe('UserApi', () => {
  let service: UserApi;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserApi]
    });
    service = TestBed.inject(UserApi);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should fetch users', (done) => {
    const mockUsers = {
      data: [{ id: 1, username: 'test', email: 'test@example.com' }],
      meta: { total: 1, page: 1, limit: 10, totalPages: 1 }
    };

    service.getAll().subscribe(response => {
      expect(response.data.length).toBe(1);
      expect(response.data[0].username).toBe('test');
      done();
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/users?page=1&limit=10`);
    expect(req.request.method).toBe('GET');
    req.flush(mockUsers);
  });

  it('should create user', (done) => {
    const newUser = { username: 'newuser', email: 'new@example.com', password: 'pass123' };
    const mockResponse = { id: 2, ...newUser, isActive: true };

    service.create(newUser).subscribe(user => {
      expect(user.id).toBe(2);
      expect(user.username).toBe('newuser');
      done();
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/users`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newUser);
    req.flush(mockResponse);
  });
});
```

**Example Component Test**: `src/app/features/users/pages/users/users.spec.ts`

```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UsersComponent } from './users';
import { UserApi } from '../../services/user-api.service';
import { of } from 'rxjs';
import { signal } from '@angular/core';

describe('UsersComponent', () => {
  let component: UsersComponent;
  let fixture: ComponentFixture<UsersComponent>;
  let mockUserApi: jasmine.SpyObj<UserApi>;

  beforeEach(async () => {
    mockUserApi = jasmine.createSpyObj('UserApi', ['getAll', 'delete']);
    mockUserApi.getAll.and.returnValue(of({
      data: [
        { id: 1, username: 'user1', email: 'user1@example.com', roles: [], isActive: true }
      ],
      meta: { total: 1, page: 1, limit: 10, totalPages: 1 }
    }));

    await TestBed.configureTestingModule({
      imports: [UsersComponent],
      providers: [
        { provide: UserApi, useValue: mockUserApi }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load users on init', () => {
    component.loadUsers();
    expect(mockUserApi.getAll).toHaveBeenCalled();
    expect(component.users().length).toBe(1);
  });

  it('should filter users by search', () => {
    component.users.set([
      { id: 1, username: 'alice', email: 'alice@example.com', roles: [], isActive: true },
      { id: 2, username: 'bob', email: 'bob@example.com', roles: [], isActive: true }
    ]);
    component.searchTerm.set('alice');

    const filtered = component.filteredUsers();
    expect(filtered.length).toBe(1);
    expect(filtered[0].username).toBe('alice');
  });
});
```

---

## 6. Security Hardening

### 6.1 Content Security Policy
**Status**: ⚠️ MISSING
**Impact**: HIGH
**Effort**: LOW

**Add to**: `src/index.html`

```html
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval';
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  font-src 'self' https://fonts.gstatic.com;
  img-src 'self' data: https:;
  connect-src 'self' http://localhost:3000;
">
```

**Production CSP** (nginx.conf):
```nginx
add_header Content-Security-Policy "default-src 'self'; script-src 'self'; style-src 'self' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://api.yourdomain.com;" always;
```

### 6.2 Security Headers
**Impact**: HIGH
**Effort**: LOW

**Add to nginx.conf**:
```nginx
# Prevent clickjacking
add_header X-Frame-Options "SAMEORIGIN" always;

# Prevent MIME type sniffing
add_header X-Content-Type-Options "nosniff" always;

# Enable XSS protection
add_header X-XSS-Protection "1; mode=block" always;

# Referrer policy
add_header Referrer-Policy "strict-origin-when-cross-origin" always;

# Permissions policy
add_header Permissions-Policy "geolocation=(), microphone=(), camera=()" always;
```

### 6.3 Environment File Security
**Impact**: HIGH
**Effort**: LOW

**Create**: `.env.example`

```env
# API Configuration
API_URL=http://localhost:3000/api

# Application
APP_NAME=Labyrinth Nexus
SESSION_TIMEOUT=1800000

# Optional: OAuth
GOOGLE_CLIENT_ID=
GITHUB_CLIENT_ID=
```

**Add to**: `.gitignore`

```
# Environment files
.env
.env.local
.env.*.local
src/environments/environment.*.ts
!src/environments/environment.example.ts
```

**Update**: `README.md`

```markdown
## Environment Setup

1. Copy example environment:
   ```bash
   cp .env.example .env
   ```

2. Update values in `.env`:
   - Set `API_URL` to your backend API
   - Configure other settings as needed

**IMPORTANT**: Never commit `.env` files to version control!
```

### 6.4 Dependency Audit
**Impact**: MEDIUM
**Effort**: LOW

**Add to**: `package.json`

```json
{
  "scripts": {
    "audit": "npm audit --audit-level=moderate",
    "audit:fix": "npm audit fix"
  }
}
```

**Add to CI** (.github/workflows/ci.yml):
```yaml
- name: Security Audit
  run: npm audit --audit-level=high
```

---

## 7. Developer Experience

### 7.1 VS Code Workspace Settings
**Status**: ⚠️ MISSING
**Impact**: LOW
**Effort**: LOW

**Create**: `.vscode/settings.json`

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
  "typescript.preferences.importModuleSpecifier": "relative",
  "typescript.updateImportsOnFileMove.enabled": "always",
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[html]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[scss]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "files.exclude": {
    "**/.angular": true,
    "**/node_modules": true,
    "**/dist": true
  },
  "search.exclude": {
    "**/node_modules": true,
    "**/dist": true,
    "**/.angular": true
  }
}
```

**Create**: `.vscode/extensions.json`

```json
{
  "recommendations": [
    "angular.ng-template",
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "editorconfig.editorconfig",
    "ms-playwright.playwright"
  ]
}
```

### 7.2 Development Scripts Enhancement
**Impact**: MEDIUM
**Effort**: LOW

**Update**: `package.json`

```json
{
  "scripts": {
    "start": "ng serve",
    "start:prod": "ng serve --configuration production",
    "build": "ng build",
    "build:prod": "ng build --configuration production",
    "build:stats": "ng build --stats-json",
    "analyze": "npx webpack-bundle-analyzer dist/labyrinth-nexus/stats.json",
    "watch": "ng build --watch --configuration development",
    "test": "ng test",
    "test:coverage": "ng test --no-watch --code-coverage",
    "test:ci": "ng test --no-watch --code-coverage --browsers=ChromeHeadless",
    "e2e": "playwright test",
    "e2e:ui": "playwright test --ui",
    "lint": "ng lint",
    "lint:fix": "ng lint --fix",
    "format": "prettier --write \"src/**/*.{ts,html,scss,json}\"",
    "format:check": "prettier --check \"src/**/*.{ts,html,scss,json}\"",
    "audit": "npm audit --audit-level=moderate",
    "audit:fix": "npm audit fix",
    "prepare": "husky install",
    "build:lib": "ng build ng-admin-core --configuration production",
    "clean": "rimraf dist .angular node_modules/.cache",
    "typecheck": "tsc --noEmit"
  }
}
```

**Install**: `npm install --save-dev rimraf`

### 7.3 Git Hooks Enhancement
**Impact**: MEDIUM
**Effort**: LOW

**Create**: `.husky/pre-push`

```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

# Run tests before push
npm run test:ci

# Check types
npm run typecheck
```

**Make executable**:
```bash
chmod +x .husky/pre-push
```

---

## 8. Template-Specific Changes

### 8.1 Remove Hardcoded Business Data
**Impact**: HIGH
**Effort**: LOW

**Files to Update**:

#### 1. `src/app/features/admin-settings/pages/admin-settings/admin-settings.ts`

**Lines 37-57** - Replace hardcoded values with placeholders:
```typescript
const settingsForm = this.fb.group({
  general: this.fb.group({
    siteName: ['My Application'], // ✅ Generic name
    siteDescription: ['Admin dashboard application'],
    supportEmail: ['admin@example.com'],
    timezone: ['UTC']
  }),
  security: this.fb.group({
    sessionTimeout: [30],
    maxLoginAttempts: [5],
    passwordExpiry: [90],
    requireEmailVerification: [true]
  }),
  email: this.fb.group({
    smtpHost: ['smtp.example.com'], // ✅ Keep as example
    smtpPort: [587],
    smtpUser: ['noreply@example.com'],
    smtpPassword: [''],
    fromEmail: ['noreply@example.com'],
    fromName: ['System']
  })
});
```

#### 2. `src/app/features/dashboard/pages/dashboard/dashboard.ts`

**Lines 133-148** - Make activities dynamic or remove:
```typescript
// Option 1: Remove example data
recentActivities = signal<Activity[]>([]);

// Load from API in ngOnInit
ngOnInit() {
  this.loadRecentActivities();
}

private loadRecentActivities() {
  // TODO: Implement API call to fetch recent activities
  // this.activityApi.getRecent().subscribe(...)
}

// Option 2: Keep as commented example
/*
// Example activity structure:
recentActivities = signal([
  {
    icon: 'login',
    title: 'User logged in',
    description: 'Admin user logged in from 192.168.1.1',
    timestamp: new Date()
  }
]);
*/
```

### 8.2 Create Configuration Constants
**Impact**: MEDIUM
**Effort**: LOW

**Create**: `src/app/core/config/app.constants.ts`

```typescript
// Application-wide constants
export const APP_CONFIG = {
  name: 'Labyrinth Nexus', // Change this for your app
  version: '1.0.0',
  defaultPageSize: 10,
  pageSizeOptions: [5, 10, 25, 50, 100],
  sessionTimeout: 30 * 60 * 1000, // 30 minutes
  refreshTokenBuffer: 2 * 60 * 1000, // 2 minutes
  dateFormat: 'yyyy-MM-dd',
  dateTimeFormat: 'yyyy-MM-dd HH:mm:ss',

  routes: {
    afterLogin: '/dashboard',
    afterLogout: '/auth/login',
    unauthorized: '/auth/unauthorized',
  }
} as const;

export const API_ENDPOINTS = {
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    logout: '/auth/logout',
    refresh: '/auth/refresh',
    profile: '/auth/profile',
  },
  users: '/users',
  roles: '/roles',
  sessions: '/sessions',
  settings: '/settings',
} as const;
```

**Usage**:
```typescript
import { APP_CONFIG } from '@core/config/app.constants';

// Instead of hardcoded values
redirectUrl: APP_CONFIG.routes.afterLogin
```

### 8.3 Make Features Optional/Modular
**Impact**: MEDIUM
**Effort**: MEDIUM

**Update**: `app.routes.ts` - Add comments for optional features:

```typescript
export const routes: Routes = [
  // Core Features (Required)
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES),
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () => import('./features/dashboard/pages/dashboard/dashboard'),
  },
  {
    path: 'profile',
    canActivate: [authGuard],
    loadComponent: () => import('./features/profile/pages/profile/profile'),
  },

  // Admin Features (Optional - can be removed if not needed)
  {
    path: 'admin',
    canActivate: [authGuard, roleGuard([RoleEnum.ADMIN])],
    children: [
      {
        path: 'users',
        loadComponent: () => import('./features/users/pages/users/users'),
      },
      {
        path: 'roles',
        loadComponent: () => import('./features/roles/pages/roles/roles'),
      },
      {
        path: 'sessions',
        loadComponent: () => import('./features/session/pages/admin-sessions/admin-sessions'),
      },
      {
        path: 'settings',
        loadComponent: () => import('./features/admin-settings/pages/admin-settings/admin-settings'),
      },
    ],
  },

  // Optional Features (Comment out if not needed)
  // {
  //   path: 'reports',
  //   canActivate: [authGuard],
  //   loadComponent: () => import('./features/reports/pages/reports/reports'),
  // },

  // Redirects
  { path: '', redirectTo: '/auth/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/auth/login' },
];
```

### 8.4 Create Setup Wizard
**Impact**: LOW
**Effort**: HIGH (Optional)

**Create**: `scripts/setup.js`

```javascript
#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function setup() {
  console.log('\n🚀 Labyrinth Nexus Setup Wizard\n');

  // App name
  const appName = await question('App name (Labyrinth Nexus): ') || 'Labyrinth Nexus';

  // API URL
  const apiUrl = await question('API URL (http://localhost:3000/api): ') || 'http://localhost:3000/api';

  // Package name
  const packageName = await question('Package name (labyrinth-nexus): ') || 'labyrinth-nexus';

  // Create config file
  const config = {
    apiUrl,
    appName,
    sessionTimeout: 1800000
  };

  fs.writeFileSync(
    path.join(__dirname, '../src/assets/config/app-config.json'),
    JSON.stringify(config, null, 2)
  );

  // Update package.json
  const packagePath = path.join(__dirname, '../package.json');
  const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  packageJson.name = packageName;
  fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2));

  console.log('\n✅ Setup complete!\n');
  console.log('Next steps:');
  console.log('  1. npm install');
  console.log('  2. npm start');
  console.log('\n');

  rl.close();
}

setup().catch(console.error);
```

**Make executable**:
```bash
chmod +x scripts/setup.js
```

**Add to package.json**:
```json
{
  "scripts": {
    "setup": "node scripts/setup.js"
  }
}
```

---

## 9. Architecture Review

### Current Architecture Score: A-

**Strengths**:
- ✅ Excellent use of modern Angular patterns
- ✅ Clean separation of concerns
- ✅ Feature-based structure
- ✅ Proper dependency injection
- ✅ Strong typing

**Areas for Improvement**:
- 🟡 No centralized state management for complex state
- 🟡 Limited error handling patterns
- 🟡 No request caching strategy
- 🟡 Missing retry logic for failed requests

### Recommended Enhancements

#### 9.1 Request Caching Interceptor
```typescript
// src/app/core/interceptors/cache.interceptor.ts
import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { tap } from 'rxjs/operators';

const cache = new Map<string, HttpResponse<any>>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export const cacheInterceptor: HttpInterceptorFn = (req, next) => {
  // Only cache GET requests
  if (req.method !== 'GET') {
    return next(req);
  }

  // Check cache
  const cachedResponse = cache.get(req.url);
  if (cachedResponse) {
    return of(cachedResponse.clone());
  }

  return next(req).pipe(
    tap(event => {
      if (event instanceof HttpResponse) {
        cache.set(req.url, event.clone());

        // Clear cache after TTL
        setTimeout(() => cache.delete(req.url), CACHE_TTL);
      }
    })
  );
};
```

#### 9.2 Retry Logic
```typescript
// src/app/core/interceptors/retry.interceptor.ts
import { HttpInterceptorFn } from '@angular/common/http';
import { retry, timer } from 'rxjs';

export const retryInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    retry({
      count: 3,
      delay: (error, retryCount) => {
        // Exponential backoff: 1s, 2s, 4s
        return timer(Math.pow(2, retryCount) * 1000);
      },
      resetOnSuccess: true
    })
  );
};
```

---

## 10. Implementation Roadmap

### Phase 1: Critical (Week 1)
**Priority**: MUST DO

- [ ] Add ESLint configuration
- [ ] Setup pre-commit hooks (husky + lint-staged)
- [ ] Add environment variable support
- [ ] Remove/parameterize hardcoded values
- [ ] Update package.json version to 1.0.0
- [ ] Add LICENSE file
- [ ] Create .env.example

**Estimated Time**: 8-12 hours

### Phase 2: High Priority (Week 2)
**Priority**: SHOULD DO

- [ ] Add CI/CD configuration
- [ ] Implement global error handler
- [ ] Add Docker configuration
- [ ] Create CONTRIBUTING.md
- [ ] Create SECURITY.md
- [ ] Add security headers to nginx config
- [ ] Implement request logging interceptor

**Estimated Time**: 12-16 hours

### Phase 3: Documentation (Week 3)
**Priority**: SHOULD DO

- [ ] Create ARCHITECTURE.md
- [ ] Create API-INTEGRATION.md
- [ ] Update README with quick start
- [ ] Add VS Code workspace settings
- [ ] Create setup wizard script
- [ ] Add code examples for common tasks

**Estimated Time**: 8-10 hours

### Phase 4: Testing (Week 4)
**Priority**: RECOMMENDED

- [ ] Add test coverage reporting
- [ ] Setup Playwright for E2E tests
- [ ] Write example E2E tests
- [ ] Improve unit test coverage
- [ ] Add test documentation

**Estimated Time**: 16-20 hours

### Phase 5: Enhancements (Week 5+)
**Priority**: NICE TO HAVE

- [ ] Add OnPush change detection
- [ ] Implement TrackBy functions
- [ ] Add loading skeletons
- [ ] Improve accessibility (ARIA labels)
- [ ] Add request caching
- [ ] Add retry logic
- [ ] Implement dark mode
- [ ] Add bundle analyzer script

**Estimated Time**: 20+ hours

---

## Quick Wins (< 1 hour each)

These can be done immediately for quick improvements:

1. ✅ Update package.json version to 1.0.0
2. ✅ Add LICENSE file
3. ✅ Create .env.example
4. ✅ Add README badges
5. ✅ Create .vscode/settings.json
6. ✅ Create .vscode/extensions.json
7. ✅ Add .dockerignore file
8. ✅ Add "prepare" script to package.json
9. ✅ Update .gitignore for .env files
10. ✅ Add app constants file

---

## Files to Create (Summary)

### Configuration
- [ ] `.eslintrc.json`
- [ ] `commitlint.config.js`
- [ ] `.env.example`
- [ ] `playwright.config.ts`
- [ ] `nginx.conf`
- [ ] `Dockerfile`
- [ ] `docker-compose.yml`
- [ ] `.dockerignore`

### GitHub
- [ ] `.github/workflows/ci.yml`

### Documentation
- [ ] `CONTRIBUTING.md`
- [ ] `SECURITY.md`
- [ ] `LICENSE`
- [ ] `docs/ARCHITECTURE.md`
- [ ] `docs/API-INTEGRATION.md`

### Scripts
- [ ] `scripts/setup.js`
- [ ] `docker-entrypoint.sh`

### VS Code
- [ ] `.vscode/settings.json`
- [ ] `.vscode/extensions.json`

### Source Files
- [ ] `src/app/core/config/app.constants.ts`
- [ ] `src/app/core/services/global-error-handler.service.ts`
- [ ] `src/app/core/services/app-config.service.ts`
- [ ] `src/app/core/interceptors/logging.interceptor.ts`
- [ ] `src/app/core/interceptors/cache.interceptor.ts`
- [ ] `src/app/core/interceptors/retry.interceptor.ts`
- [ ] `src/app/shared/components/skeleton/skeleton.component.ts`
- [ ] `src/app/shared/utils/destroy.ts`
- [ ] `src/assets/config/app-config.json`
- [ ] `src/assets/config/app-config.template.json`
- [ ] `e2e/auth.spec.ts`

---

## Summary

Your codebase is **production-ready** and serves as an **excellent foundation** for a starter template. With the improvements outlined above, it will be:

1. ✅ **Template-ready**: Parameterized and configurable
2. ✅ **Production-grade**: With proper CI/CD, Docker, and security
3. ✅ **Developer-friendly**: With excellent DX and documentation
4. ✅ **Maintainable**: With linting, testing, and best practices
5. ✅ **Scalable**: With proper architecture and patterns

**Total Estimated Effort**: 64-78 hours for complete implementation

**Minimum Viable Template**: Phase 1 + Phase 2 = 20-28 hours

**Recommended Approach**:
1. Start with Phase 1 (critical items)
2. Add Phase 2 (infrastructure)
3. Complete Phase 3 (documentation)
4. Add Phase 4 & 5 as time permits

---

**Questions or need clarification on any recommendation?**
Feel free to reach out or create an issue in the repository!
