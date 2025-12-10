# Angular Admin Starter Template

![Angular](https://img.shields.io/badge/Angular-20-red) ![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue) ![Material](https://img.shields.io/badge/Material-20-purple) ![License](https://img.shields.io/badge/license-MIT-green)

> **Production-ready Angular 20 starter template with complete authentication, authorization, and admin panel**

A modern, secure, and feature-rich Angular starter template powered by **@labyrinth-team/ng-admin-core**. Build your next admin dashboard, SaaS application, or enterprise web app in minutes, not days.

---

## 🚀 Quick Start

Get your project running in under 5 minutes:

```bash
# 1. Clone or download this template
git clone https://github.com/exitgh0st/labyrinth-nexus.git my-project
cd my-project

# 2. Run the automated setup wizard
npm run setup

# 3. Start development server
npm start
```

Navigate to `http://localhost:4200` 🎉

---

## ✨ Features

### 🔐 Complete Authentication System
- ✅ Email/password login with validation
- ✅ User registration with password strength requirements
- ✅ OAuth support (Google, GitHub, etc.)
- ✅ Automatic JWT token refresh
- ✅ Session management with inactivity timeout
- ✅ Cross-tab logout synchronization
- ✅ Remember me functionality

### 🛡️ Role-Based Access Control (RBAC)
- ✅ Flexible permission system
- ✅ Route guards for protected pages
- ✅ Conditional UI rendering with directives (`*can`, `*cannot`)
- ✅ Admin panel for user & role management
- ✅ Multi-role and multi-permission support

### 📱 Responsive Design
- ✅ Mobile-first approach
- ✅ Tablet and desktop optimized
- ✅ Material Design 3 components
- ✅ Adaptive navigation (drawer on mobile, sidebar on desktop)
- ✅ Dark mode ready

### 🏗️ Modern Angular Architecture
- ✅ Angular 20 with standalone components
- ✅ Signals for reactive state management
- ✅ Lazy-loaded routes for optimal performance
- ✅ TypeScript strict mode
- ✅ Comprehensive unit tests
- ✅ Zoneless change detection ready

### 🎨 UI Components Library
- ✅ Pre-built admin components
- ✅ Reusable form components with validation
- ✅ Data tables with pagination & sorting
- ✅ Skeleton loaders
- ✅ Empty states
- ✅ Notification system (toast & dialogs)

### 🔧 Developer Experience
- ✅ ESLint + Prettier pre-configured
- ✅ Husky + lint-staged for git hooks
- ✅ Commitlint for conventional commits
- ✅ CI/CD pipeline with GitHub Actions
- ✅ Docker support with docker-compose
- ✅ Bundle size analysis

---

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
  - [Option 1: Automated Setup](#option-1-automated-setup-recommended)
  - [Option 2: Manual Setup](#option-2-manual-setup)
- [Renaming Your Project](#renaming-your-project)
- [Initial Project Setup](#initial-project-setup)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Development Guide](#development-guide)
- [Building & Deployment](#building--deployment)
- [Docker Deployment](#docker-deployment)
- [Backend API Requirements](#backend-api-requirements)
- [Customization Guide](#customization-guide)
- [Testing](#testing)
- [Troubleshooting](#troubleshooting)

---

## 📦 Prerequisites

Before you begin, ensure you have:

- **Node.js** v18 or higher ([Download](https://nodejs.org/))
- **npm** v9 or higher (comes with Node.js)
- **Angular CLI** v20 or higher:
  ```bash
  npm install -g @angular/cli@latest
  ```
- **Git** (for cloning the template)

**Optional:**
- **Docker** & **Docker Compose** (for containerized deployment)
- **VS Code** (recommended IDE) with Angular Language Service extension

---

## 🎯 Getting Started

### Option 1: Automated Setup (Recommended)

The easiest way to get started:

```bash
# 1. Clone/download the template
git clone https://github.com/exitgh0st/labyrinth-nexus.git my-awesome-app
cd my-awesome-app

# 2. Run setup wizard (creates config, installs dependencies)
npm run setup

# 3. Start development server
npm start
```

The setup wizard will:
- Install all dependencies
- Create your configuration file
- Prompt for your API URL and app settings
- Initialize git (optional)

### Option 2: Manual Setup

For manual control:

```bash
# 1. Clone the template
git clone https://github.com/exitgh0st/labyrinth-nexus.git my-project
cd my-project

# 2. Remove the existing git history (start fresh)
rm -rf .git
git init

# 3. Install dependencies
npm install

# 4. Create configuration file
cp src/assets/config/app-config.example.json src/assets/config/app-config.json

# 5. Edit configuration
nano src/assets/config/app-config.json

# 6. Start development
npm start
```

---

## 🏷️ Renaming Your Project

After cloning the template, follow these steps to rename it to your project:

### 1. Update Project Metadata

Edit `package.json`:
```json
{
  "name": "my-awesome-app",           // ← Change this
  "version": "1.0.0",
  "description": "My awesome description"  // ← Change this
}
```

### 2. Update HTML Title

Edit `src/index.html`:
```html
<title>My Awesome App</title>  <!-- Change from "Labyrinth Nexus" -->
```

### 3. Update Navigation Component

Edit `src/app/core/components/navigation/navigation.component.html`:
```html
<span class="app-name">My Awesome App</span>  <!-- Line 13 -->
```

### 4. Update Configuration

Edit `src/assets/config/app-config.json`:
```json
{
  "apiUrl": "https://api.yourapp.com/api",
  "appName": "My Awesome App",           // ← Change this
  "sessionTimeout": 1800000,
  "inactivityTimeout": 1800000,
  "refreshBeforeExpiry": 120000
}
```

### 5. Update Angular Configuration

Edit `angular.json` (line 8):
```json
{
  "projects": {
    "my-awesome-app": {  // ← Change project name
      ...
    }
  }
}
```

### 6. Update Docker Configuration (if using)

Edit `docker-compose.yml`:
```yaml
services:
  my-awesome-app-frontend:  # ← Change service name
    container_name: my-awesome-app-frontend
    image: my-awesome-app:latest
```

Edit `Dockerfile` (line 25):
```dockerfile
COPY --from=build /app/dist/my-awesome-app/browser /usr/share/nginx/html
```

### 7. Update Package Scripts

Edit `package.json` - Update the `analyze` script (line 13):
```json
{
  "analyze": "webpack-bundle-analyzer dist/my-awesome-app/browser/stats.json"
}
```

### 8. Update Tests (Optional)

Edit `src/app/app.spec.ts` if you have specific test expectations:
```typescript
expect(compiled.querySelector('h1')?.textContent).toContain('Hello, my-awesome-app');
```

### 9. Update README

Update this README.md with your project-specific information.

### 10. Clean Build Artifacts

```bash
# Remove old build cache
rm -rf .angular
rm -rf dist
rm -rf node_modules/.cache

# Reinstall to pick up name changes
npm install

# Test the build
npm run build
```

---

## ⚙️ Initial Project Setup

### 1. Configure Your Backend API

Edit `src/assets/config/app-config.json`:

```json
{
  "apiUrl": "https://api.yourapp.com/api",  // Your backend URL
  "appName": "Your App Name",
  "sessionTimeout": 1800000,                 // 30 minutes
  "inactivityTimeout": 1800000,              // 30 minutes
  "refreshBeforeExpiry": 120000              // 2 minutes
}
```

**Important:** The `app-config.json` file is loaded at runtime, allowing you to change configuration without rebuilding.

### 2. Update Environment Files (Optional)

Edit `src/environments/environment.ts` for development:
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api'  // Local dev API
};
```

Edit `src/environments/environment.prod.ts` for production:
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://api.yourapp.com/api'  // Production API
};
```

### 3. Customize Authentication (Optional)

Edit `src/app/app.config.ts`:

```typescript
provideAuth({
  token: {
    storage: 'localStorage',  // 'localStorage', 'sessionStorage', or 'memory'
  },
  session: {
    inactivityTimeout: 30 * 60 * 1000,      // 30 min
    refreshBeforeExpiry: 2 * 60 * 1000,     // 2 min
    enableCrossTabSync: true,
  },
  routes: {
    afterLogin: '/dashboard',               // Redirect after login
    afterLogout: '/auth/login',
    unauthorized: '/auth/unauthorized',
    login: '/auth/login',
  }
})
```

### 4. Configure Roles & Permissions

Edit `src/app/features/role/enums/role.enum.ts`:

```typescript
export enum RoleEnum {
  ADMIN = 'admin',
  USER = 'user',
  MANAGER = 'manager',    // Add your roles
  EDITOR = 'editor'
}
```

### 5. Update Navigation

Edit `src/app/core/components/navigation/navigation.component.ts`:

```typescript
navItems: NavItem[] = [
  { label: 'Dashboard', icon: 'dashboard', route: '/dashboard' },
  { label: 'Reports', icon: 'assessment', route: '/reports', permission: [RoleEnum.ADMIN] },
  // Add your navigation items
];
```

### 6. Customize Styling (Optional)

Edit `src/styles.scss` to customize theme colors:

```scss
@use '@angular/material' as mat;

$primary-palette: mat.define-palette(mat.$indigo-palette);  // Change colors
$accent-palette: mat.define-palette(mat.$pink-palette);
$warn-palette: mat.define-palette(mat.$red-palette);
```

### 7. Set Up Git Hooks

The project comes with Husky pre-configured. Ensure hooks work:

```bash
# Husky should auto-install, but if not:
npm run prepare

# Test the hooks
git add .
git commit -m "test: verify git hooks"
```

### 8. Configure CI/CD (Optional)

The template includes GitHub Actions CI/CD. Update `.github/workflows/ci.yml` with your deployment configuration.

---

## 🛠️ Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **Angular** | 20.x | Frontend framework |
| **Angular Material** | 20.x | UI component library |
| **TypeScript** | 5.8.x | Type-safe development |
| **RxJS** | 7.8.x | Reactive programming |
| **Zod** | 4.x | Schema validation |
| **@labyrinth-team/ng-admin-core** | 1.x | Auth & admin library |
| **ESLint** | 9.x | Code linting |
| **Prettier** | 3.x | Code formatting |
| **Husky** | 9.x | Git hooks |
| **Commitlint** | 19.x | Commit message linting |

---

## 📁 Project Structure

```
labyrinth-nexus/
├── .github/
│   └── workflows/
│       └── ci.yml                        # CI/CD pipeline
├── projects/
│   └── ng-admin-core/                    # Reusable auth/admin library
│       ├── src/lib/
│       │   ├── auth/                     # Auth services & guards
│       │   └── core/                     # Core utilities
│       └── package.json
├── src/
│   ├── app/
│   │   ├── core/                         # Core singletons
│   │   │   ├── components/
│   │   │   │   └── navigation/          # Main navigation
│   │   │   ├── guards/                   # Route guards
│   │   │   ├── interceptors/             # HTTP interceptors
│   │   │   └── services/                 # Global services
│   │   ├── features/                     # Feature modules
│   │   │   ├── auth/                     # Authentication
│   │   │   │   ├── pages/
│   │   │   │   │   ├── login/
│   │   │   │   │   ├── register/
│   │   │   │   │   └── unauthorized/
│   │   │   │   └── auth.routes.ts
│   │   │   ├── dashboard/                # Dashboard
│   │   │   ├── profile/                  # User profile
│   │   │   ├── reports/                  # Reports
│   │   │   ├── settings/                 # User settings
│   │   │   ├── user/                     # User management (admin)
│   │   │   ├── role/                     # Role management (admin)
│   │   │   └── session/                  # Session management (admin)
│   │   ├── shared/                       # Shared utilities
│   │   ├── app.config.ts                 # App providers
│   │   ├── app.routes.ts                 # Route definitions
│   │   └── app.ts                        # Root component
│   ├── assets/
│   │   └── config/
│   │       ├── app-config.json           # Runtime config (gitignored)
│   │       └── app-config.example.json   # Config template
│   ├── environments/                     # Environment configs
│   └── styles.scss                       # Global styles
├── docker-compose.yml                    # Docker Compose config
├── Dockerfile                            # Docker build
├── nginx.conf                            # Nginx configuration
├── .gitattributes                        # Git line endings
├── .gitignore                            # Git ignore rules
├── angular.json                          # Angular CLI config
├── package.json                          # Dependencies & scripts
├── tsconfig.json                         # TypeScript config
├── DEVELOPMENT_GUIDE.md                  # Development guide
└── README.md                             # This file
```

---

## 📖 Development Guide

### Key Concepts

1. **Standalone Components**: All components are standalone (no NgModules)
2. **Signals**: Use signals for reactive state instead of RxJS BehaviorSubject
3. **Lazy Loading**: Routes are lazy-loaded for optimal performance
4. **BaseApiService**: Extend this for consistent CRUD operations
5. **Zod Validation**: All forms use Zod schemas for validation

### Adding a New Feature

See `DEVELOPMENT_GUIDE.md` for comprehensive instructions on:
- Adding new CRUD resources
- Creating forms with validation
- Implementing route guards
- Testing components and services
- Naming conventions

**Quick example - Adding a "Product" resource:**

```bash
# 1. Create feature structure
mkdir -p src/app/features/product/{components,pages,services,models,schemas}

# 2. Create files (see DEVELOPMENT_GUIDE.md for templates)
# - models/product.model.ts
# - schemas/product.schema.ts
# - services/product-api.ts
# - pages/product-list/
# - pages/product-create/
# - product.routes.ts

# 3. Add route to app.routes.ts
{
  path: 'admin/products',
  loadChildren: () => import('./features/product/product.routes').then(m => m.PRODUCT_ROUTES)
}

# 4. Add navigation item
{ label: 'Products', icon: 'inventory', route: '/admin/products' }
```

### Common Commands

```bash
# Development
npm start                    # Start dev server
npm run start:prod           # Start with production config

# Building
npm run build                # Build for development
npm run build:prod           # Build for production
npm run build:lib            # Build the ng-admin-core library
npm run build:stats          # Build with bundle stats

# Code Quality
npm run lint                 # Lint code
npm run lint:fix             # Lint and auto-fix
npm run format               # Format code with Prettier
npm run format:check         # Check formatting
npm run typecheck            # TypeScript compilation check

# Testing
npm test                     # Run tests
npm run test:coverage        # Run tests with coverage
npm run test:ci              # Run tests in CI mode

# Analysis
npm run analyze              # Analyze bundle size
```

### Using the Library

The template includes `@labyrinth-team/ng-admin-core` library with:

**Auth Services:**
```typescript
import { AuthService } from '@labyrinth-team/ng-admin-core';

authService.login({ email, password });
authService.logout();
authService.isAuthenticated();
authService.user();
```

**Guards:**
```typescript
import { authGuard, roleGuard, guestGuard } from '@labyrinth-team/ng-admin-core';

// In routes
canActivate: [authGuard]                              // Authenticated users only
canActivate: [authGuard, roleGuard(['admin'])]        // Admin only
canActivate: [guestGuard]                             // Unauthenticated only
```

**Directives:**
```html
<!-- Show for admins only -->
<button *can="{ roles: ['admin'] }">Admin Panel</button>

<!-- Hide for guests -->
<nav *cannot="{ roles: ['guest'] }">Dashboard</nav>

<!-- Show with permission -->
<button *can="{ permissions: ['users:edit'] }">Edit</button>
```

**Validators:**
```typescript
import { ZodValidators } from '@labyrinth-team/ng-admin-core';

this.form = this.fb.group({
  email: [''],
  password: ['']
}, {
  validators: ZodValidators.createValidator(loginSchema)
});
```

---

## 🏗️ Building & Deployment

### Production Build

```bash
# Build with production optimizations
npm run build:prod

# Output location
dist/labyrinth-nexus/browser/
```

Build includes:
- ✅ Ahead-of-time (AOT) compilation
- ✅ Tree shaking
- ✅ Minification & uglification
- ✅ Source maps (optional)
- ✅ Service worker (if configured)

### Build Optimization Tips

1. **Lazy load routes** - Already configured
2. **Use OnPush change detection** - For performance-critical components
3. **Optimize images** - Use WebP format
4. **Enable compression** - Gzip/Brotli on your server
5. **Use CDN** - For static assets

### Serving Production Build

```bash
# Install a simple server
npm install -g http-server

# Serve the build
http-server dist/labyrinth-nexus/browser -p 8080
```

---

## 🐳 Docker Deployment

### Quick Start with Docker Compose

```bash
# Build and start
docker-compose up -d

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

Access at `http://localhost`

### Manual Docker Build

```bash
# Build image
docker build -t my-app:latest .

# Run container
docker run -d \
  -p 80:80 \
  -e API_URL=https://api.myapp.com \
  -e APP_NAME="My App" \
  --name my-app \
  my-app:latest
```

### Environment Variables

Configure at runtime:

| Variable | Default | Description |
|----------|---------|-------------|
| `API_URL` | `http://localhost:3000/api` | Backend API URL |
| `APP_NAME` | `Labyrinth Nexus` | Application name |
| `SESSION_TIMEOUT` | `1800000` | Session timeout (ms) |
| `INACTIVITY_TIMEOUT` | `1800000` | Inactivity timeout (ms) |
| `REFRESH_BEFORE_EXPIRY` | `120000` | Token refresh time (ms) |

### Docker Health Check

The container includes automatic health checks:

```bash
# Check container health
docker ps

# Manual health check
curl http://localhost/health
```

---

## 🔌 Backend API Requirements

Your backend API must implement these endpoints:

### Authentication Endpoints

```typescript
// POST /auth/login
Request: { email: string, password: string }
Response: {
  accessToken: string;
  user: {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    roles: Array<{
      id: number;
      name: string;
      permissions: Array<{ id: string; name: string; }>;
    }>;
  }
}

// POST /auth/register
Request: { email: string, password: string, displayName: string }
Response: Same as login

// POST /auth/logout
Request: { }
Response: { success: boolean }

// POST /auth/refresh
Request: { }  // Uses refresh token from cookie
Response: { accessToken: string }

// GET /auth/me
Request: { }  // Uses access token
Response: { user: User }
```

### Required Headers

The frontend sends:
- `Authorization: Bearer {accessToken}` - For authenticated requests
- `Content-Type: application/json`

Your backend should:
- Accept these headers
- Set CORS headers for your domain
- Use HTTP-only cookies for refresh tokens (recommended)

### Example Backend Setup (NestJS)

```typescript
// Enable CORS
app.enableCors({
  origin: 'http://localhost:4200',
  credentials: true
});

// Auth controller
@Post('login')
login(@Body() dto: LoginDto, @Res() res: Response) {
  const { accessToken, refreshToken, user } = await this.authService.login(dto);

  // Set refresh token in HTTP-only cookie
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict'
  });

  return res.json({ accessToken, user });
}
```

---

## 🎨 Customization Guide

### Change Theme Colors

Edit `src/styles.scss`:

```scss
$primary: mat.define-palette(mat.$blue-palette);
$accent: mat.define-palette(mat.$amber-palette);
```

### Add Custom Pages

1. Create page component
2. Add route in `app.routes.ts`
3. Add navigation item (optional)

### Modify Navigation

Edit `src/app/core/components/navigation/navigation.component.ts`:

```typescript
navItems = [
  { label: 'Home', icon: 'home', route: '/' },
  { label: 'About', icon: 'info', route: '/about' },
  // Add items with role restrictions
  { label: 'Admin', icon: 'admin_panel_settings', route: '/admin', permission: ['admin'] }
];
```

### Custom Validation Rules

Add to `projects/ng-admin-core/src/lib/core/validators/`:

```typescript
export const customValidator = (control: AbstractControl): ValidationErrors | null => {
  // Your validation logic
  return isValid ? null : { customError: 'Error message' };
};
```

---

## 🧪 Testing

### Run Tests

```bash
# All tests
npm test

# With coverage
npm run test:coverage

# Specific file
npm test -- --include='**/auth.service.spec.ts'

# Watch mode
npm test -- --watch
```

### Test Structure

Each component/service includes:
- `*.spec.ts` - Unit tests
- Uses Jasmine & Karma
- Follows Angular testing best practices

### Example Test

```typescript
describe('LoginComponent', () => {
  it('should login successfully', () => {
    component.loginForm.patchValue({
      email: 'test@example.com',
      password: 'password123'
    });

    component.onSubmit();

    expect(authService.login).toHaveBeenCalled();
  });
});
```

---

## 🐛 Troubleshooting

### Common Issues

#### Build Fails with "Module not found"
```bash
# Clear cache and reinstall
rm -rf node_modules .angular
npm install
```

#### Token not persisting after page refresh
- Check `storage` config in `app.config.ts`
- `memory` storage clears on refresh (by design)
- Use `localStorage` for persistence

#### CORS errors with backend
- Ensure backend has CORS enabled
- Add your frontend URL to allowed origins
- Set `withCredentials: true` if using cookies

#### Route guards not working
- Verify user has required roles/permissions
- Check guard configuration in routes
- Inspect console for error messages

#### Docker container won't start
- Check Docker logs: `docker logs <container-name>`
- Verify environment variables
- Ensure port 80 is not in use

### Get Help

1. Check `DEVELOPMENT_GUIDE.md` for detailed patterns
2. Review example code in `src/app/features/`
3. Check browser console for errors
4. Enable Angular debug mode in development

---

## 📚 Documentation

- **[DEVELOPMENT_GUIDE.md](DEVELOPMENT_GUIDE.md)** - Comprehensive development guide
- **[@labyrinth-team/ng-admin-core](projects/ng-admin-core/README.md)** - Library documentation
- **[Angular Docs](https://angular.dev)** - Official Angular documentation
- **[Material Docs](https://material.angular.io)** - Material component docs

---

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Commit Convention

This project uses [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add new feature
fix: bug fix
docs: documentation changes
style: code style changes
refactor: code refactoring
test: add tests
chore: maintenance tasks
```

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [Angular Team](https://angular.dev) - Amazing framework
- [Material Design](https://material.io) - Design system
- [RxJS](https://rxjs.dev) - Reactive programming
- Open source community

---

## 📧 Support

- **Issues**: [GitHub Issues](https://github.com/exitgh0st/labyrinth-nexus/issues)
- **Discussions**: [GitHub Discussions](https://github.com/exitgh0st/labyrinth-nexus/discussions)
- **Email**: support@yourdomain.com

---

## 🗺️ Roadmap

- [ ] Add more example features (products, orders, etc.)
- [ ] Social authentication providers
- [ ] Email verification flow
- [ ] Password reset functionality
- [ ] Two-factor authentication (2FA)
- [ ] Internationalization (i18n)
- [ ] Progressive Web App (PWA) support
- [ ] Server-side rendering (SSR)

---

## ⭐ Star This Project

If you find this starter template helpful, please give it a ⭐ on GitHub!

---

**Made with ❤️ by the Labyrinth Team**

**Ready to build something amazing? [Get Started](#-quick-start) →**
