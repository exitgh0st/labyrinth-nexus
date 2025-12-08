# Labyrinth Nexus

![Angular](https://img.shields.io/badge/Angular-20-red) ![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue) ![License](https://img.shields.io/badge/license-MIT-green)

A modern, secure Angular application with comprehensive authentication and authorization features powered by the **ng-admin-core** library.

## Quick Start

Get up and running in less than 5 minutes:

```bash
# 1. Clone the repository
git clone https://github.com/your-username/labyrinth-nexus.git
cd labyrinth-nexus

# 2. Run the setup wizard (interactive)
npm run setup

# 3. Start the development server
npm start
```

Navigate to `http://localhost:4200` 🚀

**Alternative (manual setup):**
```bash
# Install dependencies
npm install

# Copy config file
cp src/assets/config/app-config.example.json src/assets/config/app-config.json

# Edit config (optional)
# nano src/assets/config/app-config.json

# Start dev server
npm start
```

## Features

- **Complete Authentication System**
  - Login with email/password
  - User registration with password strength validation
  - OAuth support (Google, GitHub)
  - Automatic token refresh
  - Session management with inactivity timeout
  - Cross-tab synchronization

- **Role-Based Access Control (RBAC)**
  - Permission-based authorization
  - Route guards for protected pages
  - Conditional UI rendering with directives
  - Admin panel for user management

- **Responsive Design**
  - Mobile-first approach
  - Tablet and desktop optimized
  - Material Design components
  - Adaptive navigation (drawer on mobile, sidebar on desktop)

- **Modern Angular Architecture**
  - Standalone components
  - Signals for reactive state
  - Lazy-loaded routes
  - TypeScript strict mode
  - Comprehensive testing

## Tech Stack

- **Angular 20** - Latest Angular framework
- **Angular Material** - UI component library
- **RxJS** - Reactive programming
- **ng-admin-core** - Custom authentication/authorization library
- **Zod** - Schema validation
- **TypeScript** - Type-safe development

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Angular CLI (`npm install -g @angular/cli`)

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd labyrinth-nexus
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure the application:
   ```bash
   cp src/assets/config/app-config.example.json src/assets/config/app-config.json
   ```

   Edit `src/assets/config/app-config.json` with your settings:
   ```json
   {
     "apiUrl": "http://localhost:3000/api",
     "appName": "Labyrinth Nexus",
     "sessionTimeout": 1800000,
     "inactivityTimeout": 1800000,
     "refreshBeforeExpiry": 120000
   }
   ```

   **Note**: Configuration is loaded at runtime from this file. The environment files serve as fallbacks.

## Development

Start the development server:

```bash
ng serve
```

Navigate to `http://localhost:4200/`. The application will automatically reload when you change source files.

## Project Structure

```
src/
├── app/
│   ├── core/                      # Core functionality
│   │   ├── components/
│   │   │   └── navigation/        # Main navigation with sidebar/drawer
│   │   └── services/
│   │       └── app-initializer.ts # App initialization logic
│   ├── features/
│   │   ├── auth/                  # Authentication features
│   │   │   ├── login/            # Login component
│   │   │   ├── register/         # Registration component
│   │   │   └── unauthorized/     # Unauthorized access page
│   │   └── dashboard/            # Dashboard component
│   ├── app.config.ts             # App configuration with providers
│   ├── app.routes.ts             # Route definitions with guards
│   └── app.ts                    # Root component
├── environments/                  # Environment configurations
└── styles.scss                   # Global styles
```

## Authentication Flow

### Login Process

1. User enters credentials on `/auth/login`
2. AuthService validates and sends request to backend
3. On success, token is stored (memory/localStorage/sessionStorage)
4. User is redirected to `/dashboard`
5. Token auto-refreshes before expiry

### Route Protection

Routes are protected using guards from ng-admin-core:

```typescript
// Public route (unauthenticated users only)
{
  path: 'auth/login',
  component: LoginComponent,
  canActivate: [guestGuard]
}

// Protected route (authentication required)
{
  path: 'dashboard',
  component: DashboardComponent,
  canActivate: [authGuard]
}

// Role-protected route
{
  path: 'admin',
  component: AdminComponent,
  canActivate: [authGuard, roleGuard(['admin'])]
}
```

## Available Routes

### Public Routes
- `/auth/login` - User login
- `/auth/register` - User registration
- `/unauthorized` - Unauthorized access page

### Protected Routes
- `/dashboard` - Main dashboard (requires authentication)
- `/profile` - User profile (requires authentication)
- `/reports` - Reports page (requires `reports:view` permission)
- `/settings` - Settings page (requires `settings:edit` permission)

### Admin Routes
- `/admin/users` - User management (requires `admin` role + `users:manage` permission)
- `/admin/roles` - Role management (requires `admin` role + `roles:manage` permission)
- `/admin/settings` - System settings (requires `admin` role + `settings:edit` permission)

## Permission-Based UI

Use the `*can` and `*cannot` directives for conditional rendering:

```html
<!-- Show only for admins -->
<button *can="{ roles: ['admin'] }">Admin Action</button>

<!-- Show only with specific permission -->
<button *can="{ permissions: ['users:edit'] }">Edit User</button>

<!-- Show if user has admin role OR moderator role -->
<nav *can="{ roles: ['admin', 'moderator'] }">
  Admin Panel
</nav>

<!-- Show if user has admin role AND users:delete permission -->
<button *can="{ roles: ['admin'], permissions: ['users:delete'], requireAll: true }">
  Delete User
</button>
```

## Using Services

### AuthService

```typescript
import { inject } from '@angular/core';
import { AuthService } from 'ng-admin-core';

export class MyComponent {
  authService = inject(AuthService);

  ngOnInit() {
    // Check if authenticated
    if (this.authService.isAuthenticated()) {
      console.log('User:', this.authService.user());
    }

    // Login
    this.authService.login({ email, password }).subscribe();

    // Logout
    this.authService.logout().subscribe();
  }
}
```

### PermissionService

```typescript
import { inject } from '@angular/core';
import { PermissionService } from 'ng-admin-core';

export class MyComponent {
  permissionService = inject(PermissionService);

  canEdit(): boolean {
    return this.permissionService.hasPermission('users:edit');
  }

  canDelete(): boolean {
    return this.permissionService.can({
      roles: ['admin'],
      permissions: ['users:delete']
    });
  }
}
```

## Building for Production

Build the application:

```bash
npm run build:prod
```

Build artifacts will be in the `dist/` directory.

## Building the Library

If you make changes to the ng-admin-core library:

```bash
npm run build:lib
```

## Docker Deployment

### Building the Docker Image

```bash
docker build -t labyrinth-nexus:latest .
```

### Running with Docker Compose

The easiest way to run with Docker:

```bash
docker-compose up -d
```

### Running the Docker Container

```bash
docker run -d \
  -p 80:80 \
  -e API_URL=https://api.yourdomain.com \
  -e APP_NAME="My App" \
  -e SESSION_TIMEOUT=1800000 \
  --name labyrinth-nexus \
  labyrinth-nexus:latest
```

### Environment Variables

Configure the application at runtime:

- `API_URL` - Backend API URL (default: `http://localhost:3000/api`)
- `APP_NAME` - Application name (default: `Labyrinth Nexus`)
- `SESSION_TIMEOUT` - Session timeout in ms (default: `1800000`)
- `INACTIVITY_TIMEOUT` - Inactivity timeout in ms (default: `1800000`)
- `REFRESH_BEFORE_EXPIRY` - Token refresh time in ms (default: `120000`)

### Docker Health Check

The container includes a health check endpoint at `/health`:

```bash
docker ps  # Check container health status
```

## CI/CD

### GitHub Actions

The project includes a complete CI/CD pipeline:

- **Lint** - Code quality checks with ESLint
- **Test** - Unit tests with coverage reporting
- **Build** - Production build verification
- **Security Audit** - Dependency vulnerability scanning
- **Type Check** - TypeScript compilation check

Workflow runs automatically on:
- Push to `master` or `develop` branches
- Pull requests to `master` or `develop`

View workflow status: `.github/workflows/ci.yml`

The library build will be in `dist/ng-admin-core/`.

## Testing

### Run unit tests

```bash
ng test
```

### Run tests for specific component

```bash
ng test --include='**/login.component.spec.ts'
```

### Run library tests

```bash
ng test ng-admin-core
```

## Code Style

This project follows Angular style guide:
- Use standalone components
- Prefer signals over BehaviorSubject
- Use computed for derived state
- Lazy load routes
- Keep components focused and small

## Component Guidelines

All components include:
- `.ts` - Component logic
- `.html` - Template
- `.scss` - Styles (responsive)
- `.spec.ts` - Unit tests

## Responsive Breakpoints

```scss
// Mobile
@media (max-width: 480px) { }

// Tablet
@media (max-width: 768px) { }

// Desktop
@media (max-width: 1024px) { }
```

## Security Features

- HTTP-only cookies for refresh tokens
- Memory storage for access tokens (configurable)
- Automatic token refresh before expiry
- Inactivity timeout (30 minutes)
- Cross-tab logout synchronization
- CSRF protection ready
- XSS protection via Angular sanitization

## Configuration

### Auth Configuration

Located in `src/app/app.config.ts`:

```typescript
provideAuth({
  token: {
    storage: 'memory', // 'localStorage', 'sessionStorage', or 'memory'
  },
  session: {
    inactivityTimeout: 30 * 60 * 1000, // 30 minutes
    refreshBeforeExpiry: 2 * 60 * 1000, // 2 minutes
    enableCrossTabSync: true,
  },
  routes: {
    afterLogin: '/dashboard',
    afterLogout: '/auth/login',
    unauthorized: '/unauthorized',
    login: '/auth/login',
  }
})
```

## Backend API Requirements

Your backend API should implement these endpoints:

- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `POST /auth/logout` - User logout
- `POST /auth/refresh` - Refresh access token
- `GET /auth/me` - Get current user
- `GET /auth/oauth/:provider` - OAuth login (optional)

### Expected Response Format

```typescript
// Login/Register/Refresh response
{
  accessToken: string;
  user: {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    roles?: Array<{
      id: number;
      name: string;
      permissions?: Array<{
        id: string | number;
        name: string;
        resource?: string;
        action?: string;
      }>;
    }>;
    permissions?: Array<{
      id: string | number;
      name: string;
      resource?: string;
      action?: string;
    }>;
  }
}
```

## Troubleshooting

### Token not persisting
- Check `storage` setting in auth configuration
- For `memory` storage, tokens are cleared on page refresh (by design)
- Use `localStorage` or `sessionStorage` for persistence

### CORS errors
- Ensure backend has CORS enabled
- Set `withCredentials: true` in auth config
- Backend should allow credentials in CORS headers

### Guards not working
- Check that guards are imported from 'ng-admin-core'
- Verify user has required roles/permissions
- Check browser console for errors

## Contributing

1. Create a feature branch
2. Make your changes
3. Write/update tests
4. Ensure all tests pass
5. Submit a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For issues and questions:
- Check the ng-admin-core library documentation
- Review the example code in this repository
- Open an issue on GitHub

## Acknowledgments

Built with:
- Angular Team for the amazing framework
- Angular Material for UI components
- The open-source community
