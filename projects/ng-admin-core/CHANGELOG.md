# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2025-12-05

### Added
- **BaseListComponent**: Enhanced with reactive pagination using Angular signals
  - Converted `skip` and `take` from properties to signals for better reactivity
  - `query` is now a computed signal derived from pagination signals
  - All pagination methods updated to use signals (`nextPage()`, `previousPage()`, `goToPage()`, `changePageSize()`)
- Comprehensive documentation for BaseListComponent in README
- Examples showing how to use BaseListComponent with Material paginator

### Fixed
- **Pagination Reactivity**: Fixed issues where pagination state wasn't updating correctly
  - Previous button now works as expected
  - Page indicator correctly displays current range (e.g., "11-20 of 50" on page 2)
  - Page navigation now properly updates the UI
  - Fixed issue where `currentPage()` computed signal wasn't recalculating when query changed

### Changed
- BaseListComponent now uses protected `skip` and `take` signals instead of public query object
- Pagination is now fully reactive and responds to all state changes

### Breaking Changes
- Components extending BaseListComponent must update pagination handling:
  - Use `this.skip.set()` and `this.take.set()` instead of modifying `this.query.skip` and `this.query.take`
  - Templates should use `[pageSize]="take()"` instead of `[pageSize]="query.take"`
  - The `query` property is now a computed signal, call it as `this.query()` when passing to API

## [1.0.2] - 2025-12-05

### Added
- MIT license declaration in package.json
- Package description for better npm discoverability
- Keywords for improved search visibility (angular, authentication, authorization, admin, rbac, jwt, permissions, guards, angular-library)
- Repository URL in package metadata
- Author information (Labyrinth Team)

### Fixed
- npm now correctly displays the MIT license instead of "no license"

## [1.0.1] - 2025-12-05

### Changed
- Updated README.md to use correct package name `@labyrinth-team/ng-admin-core` in all installation and import examples
- Updated all code examples to reflect the scoped package name

### Added
- Documentation for BaseListComponent with reactive pagination
- Core services documentation (DialogService, NotificationService, BreakpointService)
- UI components documentation (EmptyState, SkeletonLoader)
- Enhanced features section with complete library capabilities

## [1.0.0] - 2025-12-05

### Added
- Initial release of @labyrinth-team/ng-admin-core
- **Authentication Module**
  - JWT-based authentication (login, register, logout)
  - OAuth support (Google, GitHub, Facebook)
  - Automatic token refresh and management
  - Configurable token storage (memory, localStorage, sessionStorage)
  - Session management with inactivity timeout
  - Cross-tab synchronization

- **Authorization Module**
  - Role-based access control (RBAC)
  - Permission-based access control
  - `*can` and `*cannot` directives for conditional rendering
  - PermissionService for programmatic permission checks

- **Guards**
  - `authGuard` - Protect routes requiring authentication
  - `guestGuard` - Protect routes for unauthenticated users only
  - `roleGuard` - Protect routes based on roles and permissions
  - `roleGuardWithData` - Route protection using route data

- **HTTP Interceptors**
  - `authInterceptor` - Automatic token injection and 401 handling
  - Request retry with token refresh

- **Base Services**
  - `BaseApiService` - Reusable API service with CRUD operations
  - Support for generic list queries with pagination, filtering, and sorting

- **Base Components**
  - `BaseListComponent` - Abstract component for list pages
  - Reactive pagination with signals
  - Automatic loading states and error handling
  - Built-in CRUD operation methods

- **UI Components**
  - `EmptyState` - Customizable empty state component
  - `SkeletonLoader` - Loading skeleton for tables, cards, and lists

- **Core Services**
  - `DialogService` - SweetAlert2-based confirmation dialogs
  - `NotificationService` - Toast notifications (success, error, info, warning)
  - `BreakpointService` - Responsive breakpoint detection with signals

- **Configuration**
  - `provideAdminCore` - Core library configuration
  - `provideAuth` - Authentication configuration
  - Extensive configuration options for endpoints, storage, session management, and routing

- **Validation**
  - Zod-based validation utilities
  - Pre-built validation schemas

- **TypeScript Support**
  - Full TypeScript definitions
  - Generic types for flexible API usage
  - Comprehensive interfaces and models

### Dependencies
- Angular 20.0.0+
- Angular Material 20.0.0+
- RxJS 7.8.0+
- Zod 4.0.0+
[1.1.0]: https://github.com/exitgh0st/labyrinth-vault/compare/v1.0.2...v1.1.0
