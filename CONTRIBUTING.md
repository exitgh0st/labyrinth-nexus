# Contributing to Labyrinth Nexus

Thank you for your interest in contributing to Labyrinth Nexus! This document provides guidelines and instructions for contributing.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Code Standards](#code-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Testing](#testing)
- [Documentation](#documentation)

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment for all contributors.

## Getting Started

### Prerequisites

- Node.js 20.x or higher
- npm 10.x or higher
- Git

### Initial Setup

1. **Fork the repository**
   ```bash
   # Click the "Fork" button on GitHub
   ```

2. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR-USERNAME/labyrinth-nexus.git
   cd labyrinth-nexus
   ```

3. **Add upstream remote**
   ```bash
   git remote add upstream https://github.com/ORIGINAL-OWNER/labyrinth-nexus.git
   ```

4. **Install dependencies**
   ```bash
   npm install
   ```

5. **Copy configuration**
   ```bash
   cp src/assets/config/app-config.example.json src/assets/config/app-config.json
   ```

6. **Start development server**
   ```bash
   npm start
   ```

## Development Workflow

### Branching Strategy

- `master` - Production-ready code
- `develop` - Integration branch for features
- `feature/*` - New features
- `fix/*` - Bug fixes
- `docs/*` - Documentation updates
- `refactor/*` - Code refactoring
- `test/*` - Test improvements

### Working on a Feature

1. **Create a feature branch**
   ```bash
   git checkout -b feature/my-new-feature
   ```

2. **Make your changes**
   - Write clean, maintainable code
   - Follow code standards (below)
   - Add tests for new functionality

3. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add amazing new feature"
   ```

4. **Keep your branch updated**
   ```bash
   git fetch upstream
   git rebase upstream/master
   ```

5. **Push to your fork**
   ```bash
   git push origin feature/my-new-feature
   ```

6. **Create a Pull Request**
   - Go to GitHub and create a PR
   - Fill out the PR template
   - Link any related issues

## Code Standards

### TypeScript

- **Use strict mode** - Already configured in `tsconfig.json`
- **Avoid `any` type** - Use proper typing
- **Use signals for state** - Follow Angular 20 patterns
- **Use `inject()` for DI** - Modern dependency injection
- **Prefer `const` over `let`** - Use immutable variables when possible

Example:
```typescript
import { Component, signal, inject } from '@angular/core';
import { MyService } from './my.service';

@Component({
  selector: 'app-my-component',
  standalone: true,
  // ...
})
export class MyComponent {
  private myService = inject(MyService);

  count = signal(0);

  increment(): void {
    this.count.update(val => val + 1);
  }
}
```

### Angular

- **Use standalone components** - No NgModules
- **Lazy load routes** - Keep bundles small
- **Use OnPush change detection** - Better performance
- **Add trackBy to *ngFor** - Prevent unnecessary re-renders
- **Use computed signals** - For derived state

Example:
```typescript
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  // ...
})
export class MyComponent {
  items = signal<Item[]>([]);

  // Computed signal
  itemCount = computed(() => this.items().length);

  // TrackBy function
  trackById(index: number, item: Item): number {
    return item.id;
  }
}
```

### Components

- **Keep components focused** - Single responsibility
- **Extract reusable logic** - Into services or utilities
- **Use semantic HTML** - For accessibility
- **Add ARIA labels** - For screen readers

### Services

- **Use `providedIn: 'root'`** - For singleton services
- **Return Observables** - For async operations
- **Handle errors** - Provide meaningful error messages
- **Add JSDoc comments** - For public methods

Example:
```typescript
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DataService {
  private http = inject(HttpClient);

  /**
   * Fetch data from the API
   * @param id - The data ID
   * @returns Observable of data
   */
  getData(id: number): Observable<Data> {
    return this.http.get<Data>(`/api/data/${id}`);
  }
}
```

### Styling

- **Use SCSS** - Already configured
- **Follow BEM naming** - For CSS classes (optional but recommended)
- **Use Angular Material** - For UI components
- **Responsive design** - Mobile-first approach

### File Naming

- **Components**: `my-component.ts` (kebab-case)
- **Services**: `my-service.service.ts`
- **Models**: `my-model.ts`
- **Constants**: `my.constants.ts`

## Commit Guidelines

We use [Conventional Commits](https://www.conventionalcommits.org/) enforced by commitlint.

### Commit Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation changes
- `style` - Code style changes (formatting, semicolons, etc.)
- `refactor` - Code refactoring
- `test` - Adding or updating tests
- `chore` - Maintenance tasks
- `perf` - Performance improvements
- `ci` - CI/CD changes
- `build` - Build system changes
- `revert` - Revert previous commit

### Examples

```bash
# Feature
git commit -m "feat(auth): add OAuth login support"

# Bug fix
git commit -m "fix(dashboard): resolve chart rendering issue"

# Documentation
git commit -m "docs(readme): update installation instructions"

# Breaking change
git commit -m "feat(api)!: change user endpoint structure

BREAKING CHANGE: User API now returns data in different format"
```

## Pull Request Process

### Before Submitting

1. **Update your branch**
   ```bash
   git fetch upstream
   git rebase upstream/master
   ```

2. **Run tests**
   ```bash
   npm test
   ```

3. **Run linter**
   ```bash
   npm run lint
   ```

4. **Format code**
   ```bash
   npm run format
   ```

5. **Build the project**
   ```bash
   npm run build:prod
   ```

### PR Requirements

- ✅ All tests passing
- ✅ Code linted and formatted
- ✅ No TypeScript errors
- ✅ Documentation updated (if needed)
- ✅ Commit messages follow conventions
- ✅ PR description filled out

### PR Template

When creating a PR, include:

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
How to test the changes

## Checklist
- [ ] Tests pass
- [ ] Code formatted
- [ ] Documentation updated
- [ ] No console errors

## Screenshots (if applicable)
Add screenshots for UI changes
```

### Review Process

1. **Automated checks** - CI must pass
2. **Code review** - At least one approval required
3. **Address feedback** - Make requested changes
4. **Merge** - Squash and merge to master

## Testing

### Unit Tests

- Write tests for all new features
- Maintain minimum 80% coverage
- Test edge cases and error scenarios

Example:
```typescript
describe('MyComponent', () => {
  let component: MyComponent;
  let fixture: ComponentFixture<MyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(MyComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should increment count', () => {
    component.increment();
    expect(component.count()).toBe(1);
  });
});
```

### Running Tests

```bash
# Run tests in watch mode
npm test

# Run tests once
npm run test:ci

# Generate coverage report
npm run test:coverage
```

## Documentation

### Code Documentation

- Add JSDoc comments for public methods
- Include examples for complex functionality
- Document parameters and return types

### README Updates

- Update README.md for new features
- Add usage examples
- Update screenshots if UI changed

### Changelog

- Significant changes should be noted
- Follow Keep a Changelog format
- Group by type (Added, Changed, Fixed, etc.)

## Questions?

- Open an issue for questions
- Check existing issues and PRs
- Reach out to maintainers

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to Labyrinth Nexus! 🚀
