# Labyrinth Nexus Development Guide

> **Comprehensive guide for developing features in the Labyrinth Nexus Angular application**

## Table of Contents
- [Project Overview](#project-overview)
- [Architecture & Structure](#architecture--structure)
- [Naming Conventions](#naming-conventions)
- [Adding New Features](#adding-new-features)
- [Adding New Resources](#adding-new-resources)
- [Component Patterns](#component-patterns)
- [Service Patterns](#service-patterns)
- [Routing Patterns](#routing-patterns)
- [Form Patterns](#form-patterns)
- [Testing Patterns](#testing-patterns)
- [Best Practices](#best-practices)

---

## Project Overview

### Tech Stack
- **Framework**: Angular 20 (Standalone Components)
- **UI Library**: Angular Material 20
- **State Management**: Signals (Angular built-in)
- **Validation**: Zod schemas
- **Authentication**: JWT-based with @labyrinth-team/ng-admin-core
- **Styling**: SCSS with Material theming

### Key Features
- Role-Based Access Control (RBAC)
- Session Management
- User & Role Administration
- Material Design UI
- Responsive Layout

---

## Architecture & Structure

### Project Structure
```
labyrinth-nexus/
├── src/
│   ├── app/
│   │   ├── core/                    # Core singleton services
│   │   │   ├── components/          # Layout components (Navigation, etc.)
│   │   │   ├── guards/              # Route guards
│   │   │   ├── interceptors/        # HTTP interceptors
│   │   │   └── services/            # Global services
│   │   ├── features/                # Feature modules
│   │   │   ├── {feature-name}/      # Each feature is self-contained
│   │   │   │   ├── components/      # Feature-specific components
│   │   │   │   ├── pages/           # Routable page components
│   │   │   │   ├── services/        # Feature services (API, state)
│   │   │   │   ├── models/          # TypeScript interfaces/types
│   │   │   │   ├── enums/           # Enums
│   │   │   │   ├── schemas/         # Zod validation schemas
│   │   │   │   └── {feature}.routes.ts
│   │   ├── shared/                  # Shared utilities
│   │   ├── app.routes.ts            # Main routing configuration
│   │   └── app.ts                   # Root component
│   ├── assets/                      # Static assets
│   ├── environments/                # Environment configs
│   └── styles/                      # Global styles
├── projects/
│   └── ng-admin-core/               # Reusable library
└── docs/                            # Documentation
```

### Feature Module Structure
Each feature follows this consistent structure:
```
features/{feature-name}/
├── components/                      # Reusable components within feature
│   ├── {component-name}/
│   │   ├── {component-name}.ts
│   │   ├── {component-name}.html
│   │   ├── {component-name}.scss
│   │   └── {component-name}.spec.ts
├── pages/                           # Routable page components
│   ├── {page-name}/
│   │   ├── {page-name}.ts
│   │   ├── {page-name}.html
│   │   ├── {page-name}.scss
│   │   └── {page-name}.spec.ts
├── services/                        # Feature services
│   ├── {resource}-api.ts            # API service
│   ├── {resource}-store.ts          # State management (if needed)
│   └── *.spec.ts
├── models/                          # TypeScript interfaces
│   └── {model}.model.ts
├── enums/                           # Enums
│   └── {enum}.enum.ts
├── schemas/                         # Zod schemas
│   └── {resource}.schema.ts
└── {feature}.routes.ts              # Feature routing
```

---

## Naming Conventions

### Files & Folders

| Type | Convention | Example |
|------|-----------|---------|
| **Component** | `{name}.ts` (no suffix) | `user-list.ts` |
| **Service** | `{name}-{type}.ts` | `user-api.ts`, `auth.service.ts` |
| **Interface** | `{name}.model.ts` | `user.model.ts` |
| **Enum** | `{name}.enum.ts` | `role.enum.ts` |
| **Schema** | `{name}.schema.ts` | `user.schema.ts` |
| **Guard** | `{name}.guard.ts` | `auth.guard.ts` |
| **Interceptor** | `{name}.interceptor.ts` | `auth.interceptor.ts` |
| **Routes** | `{feature}.routes.ts` | `user.routes.ts` |
| **Spec** | `{name}.spec.ts` | `user-list.spec.ts` |

### Code Naming

| Element | Convention | Example |
|---------|-----------|---------|
| **Component Class** | PascalCase | `UserList`, `RoleCreate` |
| **Service Class** | PascalCase + Suffix | `UserApi`, `AuthService` |
| **Interface** | PascalCase | `User`, `Role`, `Session` |
| **Enum** | PascalCase + "Enum" | `RoleEnum`, `StatusEnum` |
| **Enum Values** | UPPER_SNAKE_CASE | `ADMIN`, `SUPER_ADMIN` |
| **Function** | camelCase | `getUserById`, `createRole` |
| **Variable** | camelCase | `userId`, `isLoading` |
| **Signal** | camelCase | `user`, `isLoading` |
| **Constant** | UPPER_SNAKE_CASE | `API_URL`, `MAX_RETRIES` |
| **Route Path** | kebab-case | `/admin/users`, `/user-profile` |
| **CSS Class** | kebab-case | `.user-list`, `.btn-primary` |

### Component Selectors
- **Prefix**: None (standalone components) or `app-` for app-wide
- **Format**: kebab-case
- **Examples**: `user-list`, `role-form`, `app-navigation`

---

## Adding New Features

### Step 1: Generate Feature Structure

Create the feature folder:
```bash
mkdir -p src/app/features/{feature-name}/{components,pages,services,models,enums,schemas}
```

### Step 2: Create Feature Components

For a typical CRUD feature, you'll need:

1. **List Page** - Display all records in a table
2. **Create Page** - Form to create new record
3. **Edit Page** - Form to edit existing record
4. **Detail/View Page** (optional) - Read-only view of a record

### Step 3: Create Feature Services

1. **API Service** - HTTP calls to backend
2. **Store Service** (optional) - Local state management if needed

### Step 4: Define Models & Schemas

1. **TypeScript Interface** - Type definitions
2. **Zod Schema** - Validation rules

### Step 5: Setup Routing

Create `{feature}.routes.ts` with all routes

### Step 6: Integrate with Main App

1. Add route to `app.routes.ts`
2. Add navigation item to `navigation.component.ts`
3. Add route guards if needed

---

## Adding New Resources

> **Follow this pattern for consistent CRUD resources (Users, Roles, Products, etc.)**

### Example: Adding a "Product" Resource

#### 1. Create Models (`models/product.model.ts`)
```typescript
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductCreateInput {
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
}

export interface ProductEditInput extends ProductCreateInput {
  isActive: boolean;
}
```

#### 2. Create Enums (`enums/product-category.enum.ts`)
```typescript
export enum ProductCategoryEnum {
  ELECTRONICS = 'electronics',
  CLOTHING = 'clothing',
  FOOD = 'food',
  BOOKS = 'books'
}
```

#### 3. Create Schemas (`schemas/product.schema.ts`)
```typescript
import { z } from 'zod';

export const productCreateSchema = z.object({
  name: z.string()
    .min(3, 'Product name must be at least 3 characters')
    .max(100, 'Product name must not exceed 100 characters'),
  description: z.string()
    .min(10, 'Description must be at least 10 characters'),
  price: z.number()
    .positive('Price must be positive'),
  category: z.string()
    .min(1, 'Category is required'),
  stock: z.number()
    .int('Stock must be an integer')
    .nonnegative('Stock cannot be negative')
});

export const productEditSchema = productCreateSchema.extend({
  isActive: z.boolean()
});

// Export types inferred from schemas
export type ProductCreateFormData = z.infer<typeof productCreateSchema>;
export type ProductEditFormData = z.infer<typeof productEditSchema>;
```

#### 4. Create API Service (`services/product-api.ts`)
```typescript
import { Injectable, inject } from '@angular/core';
import { BaseApiService } from '@labyrinth-team/ng-admin-core';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductApi extends BaseApiService<Product, string> {
  protected resourcePath = 'products';

  // Add custom methods if needed
  getByCategory(category: string) {
    return this.http.get<Product[]>(`${this.getResourceUrl()}/category/${category}`);
  }
}
```

#### 5. Create List Page (`pages/product-list/product-list.ts`)
```typescript
import { Component, inject } from '@angular/core';
import { BaseListComponent } from '@labyrinth-team/ng-admin-core';
import { Product } from '../../models/product.model';
import { ProductApi } from '../../services/product-api';

@Component({
  selector: 'product-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatPaginatorModule
  ],
  templateUrl: './product-list.html',
  styleUrl: './product-list.scss'
})
export class ProductList extends BaseListComponent<Product, string> {
  protected apiService = inject(ProductApi);
  protected baseRoute = '/admin/products';
  protected itemName = 'product';

  displayedColumns = ['name', 'category', 'price', 'stock', 'isActive', 'actions'];

  toggleActive(product: Product) {
    this.apiService.update(product.id, { isActive: !product.isActive })
      .subscribe(() => this.loadItems());
  }
}
```

#### 6. Create List Template (`pages/product-list/product-list.html`)
```html
<div class="page-container">
  <div class="page-header">
    <h1>Products</h1>
    <button mat-raised-button color="primary" (click)="create()">
      <mat-icon>add</mat-icon>
      Add Product
    </button>
  </div>

  @if (loading()) {
    <lb-skeleton-loader [rows]="5" [columns]="6" type="table" />
  } @else if (error()) {
    <div class="error-message">{{ error() }}</div>
  } @else if (items().length === 0) {
    <lb-empty-state
      icon="inventory_2"
      title="No products found"
      message="Get started by adding your first product"
      actionText="Add Product"
      (action)="create()"
    />
  } @else {
    <mat-card>
      <table mat-table [dataSource]="items()">
        <ng-container matColumnDef="name">
          <th mat-header-cell *matHeaderCellDef>Name</th>
          <td mat-cell *matCellDef="let product">{{ product.name }}</td>
        </ng-container>

        <ng-container matColumnDef="category">
          <th mat-header-cell *matHeaderCellDef>Category</th>
          <td mat-cell *matCellDef="let product">{{ product.category }}</td>
        </ng-container>

        <ng-container matColumnDef="price">
          <th mat-header-cell *matHeaderCellDef>Price</th>
          <td mat-cell *matCellDef="let product">{{ product.price | currency }}</td>
        </ng-container>

        <ng-container matColumnDef="stock">
          <th mat-header-cell *matHeaderCellDef>Stock</th>
          <td mat-cell *matCellDef="let product">{{ product.stock }}</td>
        </ng-container>

        <ng-container matColumnDef="isActive">
          <th mat-header-cell *matHeaderCellDef>Status</th>
          <td mat-cell *matCellDef="let product">
            <span [class.active]="product.isActive" [class.inactive]="!product.isActive">
              {{ product.isActive ? 'Active' : 'Inactive' }}
            </span>
          </td>
        </ng-container>

        <ng-container matColumnDef="actions">
          <th mat-header-cell *matHeaderCellDef>Actions</th>
          <td mat-cell *matCellDef="let product">
            <button mat-icon-button [matMenuTriggerFor]="menu">
              <mat-icon>more_vert</mat-icon>
            </button>
            <mat-menu #menu="matMenu">
              <button mat-menu-item (click)="view(product.id)">
                <mat-icon>visibility</mat-icon>
                <span>View</span>
              </button>
              <button mat-menu-item (click)="edit(product.id)">
                <mat-icon>edit</mat-icon>
                <span>Edit</span>
              </button>
              <button mat-menu-item (click)="toggleActive(product)">
                <mat-icon>{{ product.isActive ? 'block' : 'check_circle' }}</mat-icon>
                <span>{{ product.isActive ? 'Deactivate' : 'Activate' }}</span>
              </button>
              <button mat-menu-item (click)="delete(product.id)">
                <mat-icon color="warn">delete</mat-icon>
                <span>Delete</span>
              </button>
            </mat-menu>
          </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
      </table>

      <mat-paginator
        [length]="total()"
        [pageSize]="10"
        [pageSizeOptions]="[5, 10, 25, 50]"
        (page)="goToPage($event.pageIndex + 1); changePageSize($event.pageSize)"
      />
    </mat-card>
  }
</div>
```

#### 7. Create Form Component (`components/product-form/product-form.ts`)
```typescript
import { Component, input, output, effect, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ZodValidators } from '@labyrinth-team/ng-admin-core';
import { Product, ProductCreateInput, ProductEditInput } from '../../models/product.model';
import { productCreateSchema, productEditSchema } from '../../schemas/product.schema';
import { ProductCategoryEnum } from '../../enums/product-category.enum';

@Component({
  selector: 'product-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCheckboxModule
  ],
  templateUrl: './product-form.html',
  styleUrl: './product-form.scss'
})
export class ProductForm {
  private fb = inject(FormBuilder);

  // Inputs & Outputs
  product = input<Product | null>(null);
  isEditMode = input<boolean>(false);
  submitProduct = output<ProductCreateInput | ProductEditInput>();
  cancel = output<void>();

  // Form setup
  productForm = this.fb.group({
    name: ['', Validators.required],
    description: ['', Validators.required],
    price: [0, Validators.required],
    category: ['', Validators.required],
    stock: [0, Validators.required],
    isActive: [true]
  }, {
    validators: this.isEditMode()
      ? ZodValidators.createValidator(productEditSchema)
      : ZodValidators.createValidator(productCreateSchema)
  });

  categories = Object.values(ProductCategoryEnum);

  constructor() {
    // Load product data when in edit mode
    effect(() => {
      const product = this.product();
      if (product && this.isEditMode()) {
        this.productForm.patchValue(product);
      }
    });
  }

  onSubmit() {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    this.submitProduct.emit(this.productForm.value as ProductCreateInput | ProductEditInput);
  }

  onCancel() {
    this.cancel.emit();
  }
}
```

#### 8. Create Routes (`product.routes.ts`)
```typescript
import { Routes } from '@angular/router';
import { authGuard, roleGuard } from '@labyrinth-team/ng-admin-core';
import { RoleEnum } from '../role/enums/role.enum';

export const PRODUCT_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/product-list/product-list').then(m => m.ProductList),
    canActivate: [authGuard, roleGuard([RoleEnum.ADMIN])]
  },
  {
    path: 'create',
    loadComponent: () => import('./pages/product-create/product-create').then(m => m.ProductCreate),
    canActivate: [authGuard, roleGuard([RoleEnum.ADMIN])]
  },
  {
    path: ':id',
    loadComponent: () => import('./pages/product-detail/product-detail').then(m => m.ProductDetail),
    canActivate: [authGuard]
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./pages/product-edit/product-edit').then(m => m.ProductEdit),
    canActivate: [authGuard, roleGuard([RoleEnum.ADMIN])]
  }
];
```

#### 9. Add to Main Routes (`app.routes.ts`)
```typescript
{
  path: 'admin/products',
  loadChildren: () => import('./features/product/product.routes').then(m => m.PRODUCT_ROUTES),
  canActivate: [authGuard, roleGuard([RoleEnum.ADMIN])]
}
```

#### 10. Add Navigation Item (`core/components/navigation/navigation.component.ts`)
```typescript
navItems: NavItem[] = [
  // ... existing items
  {
    label: 'Products',
    icon: 'inventory_2',
    route: '/admin/products',
    permission: [RoleEnum.ADMIN]
  }
];
```

---

## Component Patterns

### Page Component Pattern
Page components are routable and container components:

```typescript
import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'feature-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './feature-page.html',
  styleUrl: './feature-page.scss'
})
export class FeaturePage {
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  // Use signals for reactive state
  data = signal<any>(null);
  isLoading = signal(false);
  error = signal<string | null>(null);

  constructor() {
    this.loadData();
  }

  loadData() {
    // Implementation
  }
}
```

### Presentational Component Pattern
Dumb/presentational components:

```typescript
import { Component, input, output } from '@angular/core';

@Component({
  selector: 'feature-card',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  templateUrl: './feature-card.html',
  styleUrl: './feature-card.scss'
})
export class FeatureCard {
  // Inputs with signal API
  title = input.required<string>();
  description = input<string>('');

  // Outputs
  cardClick = output<void>();

  handleClick() {
    this.cardClick.emit();
  }
}
```

---

## Service Patterns

### API Service Pattern
```typescript
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseApiService, ADMIN_CORE_CONFIG } from '@labyrinth-team/ng-admin-core';
import { Observable } from 'rxjs';
import { Resource } from '../models/resource.model';

@Injectable({
  providedIn: 'root'
})
export class ResourceApi extends BaseApiService<Resource, string> {
  protected resourcePath = 'resources';

  // Custom endpoint methods
  getActive(): Observable<Resource[]> {
    return this.http.get<Resource[]>(`${this.getResourceUrl()}/active`);
  }

  archive(id: string): Observable<void> {
    return this.http.post<void>(`${this.getResourceUrl(id)}/archive`, {});
  }
}
```

### State Service Pattern (Optional)
For complex local state management:

```typescript
import { Injectable, signal, computed } from '@angular/core';
import { Resource } from '../models/resource.model';

@Injectable({
  providedIn: 'root'
})
export class ResourceStore {
  // Private signals
  private _resources = signal<Resource[]>([]);
  private _selectedId = signal<string | null>(null);

  // Public readonly signals
  resources = this._resources.asReadonly();
  selectedId = this._selectedId.asReadonly();

  // Computed signals
  selectedResource = computed(() => {
    const id = this._selectedId();
    return this._resources().find(r => r.id === id) ?? null;
  });

  activeResources = computed(() =>
    this._resources().filter(r => r.isActive)
  );

  // Methods to update state
  setResources(resources: Resource[]) {
    this._resources.set(resources);
  }

  addResource(resource: Resource) {
    this._resources.update(resources => [...resources, resource]);
  }

  updateResource(id: string, updates: Partial<Resource>) {
    this._resources.update(resources =>
      resources.map(r => r.id === id ? { ...r, ...updates } : r)
    );
  }

  removeResource(id: string) {
    this._resources.update(resources => resources.filter(r => r.id !== id));
  }

  selectResource(id: string | null) {
    this._selectedId.set(id);
  }
}
```

---

## Routing Patterns

### Feature Routes Structure
```typescript
import { Routes } from '@angular/router';
import { authGuard, roleGuard } from '@labyrinth-team/ng-admin-core';
import { RoleEnum } from '../role/enums/role.enum';

export const FEATURE_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/feature-list/feature-list').then(m => m.FeatureList),
    canActivate: [authGuard, roleGuard([RoleEnum.ADMIN])]
  },
  {
    path: 'create',
    loadComponent: () => import('./pages/feature-create/feature-create').then(m => m.FeatureCreate),
    canActivate: [authGuard, roleGuard([RoleEnum.ADMIN])]
  },
  {
    path: ':id',
    loadComponent: () => import('./pages/feature-detail/feature-detail').then(m => m.FeatureDetail),
    canActivate: [authGuard]
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./pages/feature-edit/feature-edit').then(m => m.FeatureEdit),
    canActivate: [authGuard, roleGuard([RoleEnum.ADMIN])]
  }
];
```

### Route Guard Usage
```typescript
// Authentication only
canActivate: [authGuard]

// Authentication + specific roles
canActivate: [authGuard, roleGuard([RoleEnum.ADMIN])]

// Authentication + multiple roles (any)
canActivate: [authGuard, roleGuard([RoleEnum.ADMIN, RoleEnum.MANAGER])]

// Authentication + specific permissions
canActivate: [authGuard, roleGuard(undefined, ['users:read', 'users:write'])]
```

---

## Form Patterns

### Reactive Forms with Zod Validation

#### 1. Define Schema
```typescript
import { z } from 'zod';

export const userCreateSchema = z.object({
  email: z.string()
    .email('Invalid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z.string(),
  displayName: z.string()
    .min(2, 'Name must be at least 2 characters'),
  roles: z.array(z.string())
    .min(1, 'At least one role is required')
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword']
});

export type UserCreateFormData = z.infer<typeof userCreateSchema>;
```

#### 2. Create Form Component
```typescript
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ZodValidators, ValidationMessageService } from '@labyrinth-team/ng-admin-core';
import { userCreateSchema } from '../../schemas/user.schema';

@Component({
  selector: 'user-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './user-form.html'
})
export class UserForm {
  private fb = inject(FormBuilder);
  validationService = inject(ValidationMessageService);

  userForm = this.fb.group({
    email: [''],
    password: [''],
    confirmPassword: [''],
    displayName: [''],
    roles: [[]]
  }, {
    validators: ZodValidators.createValidator(userCreateSchema)
  });

  onSubmit() {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    const formData = this.userForm.value;
    // Submit logic
  }

  getError(controlName: string): string {
    return this.validationService.getErrorMessage(
      this.userForm.get(controlName)
    );
  }
}
```

#### 3. Form Template
```html
<form [formGroup]="userForm" (ngSubmit)="onSubmit()">
  <mat-form-field appearance="outline">
    <mat-label>Email</mat-label>
    <input matInput type="email" formControlName="email" />
    <mat-error>{{ getError('email') }}</mat-error>
  </mat-form-field>

  <mat-form-field appearance="outline">
    <mat-label>Password</mat-label>
    <input matInput type="password" formControlName="password" />
    <mat-error>{{ getError('password') }}</mat-error>
  </mat-form-field>

  <mat-form-field appearance="outline">
    <mat-label>Confirm Password</mat-label>
    <input matInput type="password" formControlName="confirmPassword" />
    <mat-error>{{ getError('confirmPassword') }}</mat-error>
  </mat-form-field>

  <mat-form-field appearance="outline">
    <mat-label>Display Name</mat-label>
    <input matInput formControlName="displayName" />
    <mat-error>{{ getError('displayName') }}</mat-error>
  </mat-form-field>

  <button mat-raised-button color="primary" type="submit">
    Submit
  </button>
</form>
```

---

## Testing Patterns

### Component Tests
```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { FeatureComponent } from './feature.component';

describe('FeatureComponent', () => {
  let component: FeatureComponent;
  let fixture: ComponentFixture<FeatureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeatureComponent],
      providers: [
        provideZonelessChangeDetection()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FeatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display title', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Expected Title');
  });
});
```

### Service Tests
```typescript
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ResourceApi } from './resource-api';

describe('ResourceApi', () => {
  let service: ResourceApi;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ResourceApi]
    });

    service = TestBed.inject(ResourceApi);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should fetch resources', () => {
    const mockData = [{ id: '1', name: 'Test' }];

    service.getAll().subscribe(response => {
      expect(response.data).toEqual(mockData);
    });

    const req = httpMock.expectOne(`${service['apiUrl']}/resources`);
    expect(req.request.method).toBe('GET');
    req.flush({ data: mockData, total: 1 });
  });
});
```

---

## Best Practices

### 1. Component Design
- ✅ **DO** use standalone components
- ✅ **DO** use signals for reactive state
- ✅ **DO** keep components focused and single-purpose
- ✅ **DO** use `input()` and `output()` for component communication
- ❌ **DON'T** use `@Input()` and `@Output()` decorators (use signals instead)
- ❌ **DON'T** put business logic in components (use services)

### 2. State Management
- ✅ **DO** use signals for local state
- ✅ **DO** use computed signals for derived state
- ✅ **DO** keep state immutable (use `update()` not direct mutation)
- ❌ **DON'T** use RxJS BehaviorSubject unless necessary
- ❌ **DON'T** mutate signal values directly

### 3. Services
- ✅ **DO** provide services at root level when possible
- ✅ **DO** use dependency injection with `inject()`
- ✅ **DO** extend `BaseApiService` for CRUD operations
- ✅ **DO** return Observables from service methods
- ❌ **DON'T** use constructor injection (use `inject()` instead)
- ❌ **DON'T** make HTTP calls directly in components

### 4. Forms
- ✅ **DO** use Reactive Forms with Zod validation
- ✅ **DO** use `ZodValidators.createValidator()`
- ✅ **DO** use `ValidationMessageService` for error messages
- ✅ **DO** mark forms as touched on submit to show errors
- ❌ **DON'T** use Template-driven forms
- ❌ **DON'T** hardcode validation messages in templates

### 5. Routing
- ✅ **DO** use lazy loading for feature modules
- ✅ **DO** protect routes with guards
- ✅ **DO** use route parameters for IDs
- ✅ **DO** handle navigation in services, not components
- ❌ **DON'T** use eager loading for large features
- ❌ **DON'T** forget authentication guards on protected routes

### 6. Code Quality
- ✅ **DO** use TypeScript strict mode
- ✅ **DO** define interfaces for all models
- ✅ **DO** use enums for fixed value sets
- ✅ **DO** write unit tests for critical logic
- ✅ **DO** use ESLint and Prettier
- ❌ **DON'T** use `any` type (use proper types)
- ❌ **DON'T** leave console.log in production code
- ❌ **DON'T** commit commented-out code

### 7. Performance
- ✅ **DO** use `OnPush` change detection when beneficial
- ✅ **DO** use trackBy for `*ngFor` loops
- ✅ **DO** unsubscribe from observables (or use async pipe)
- ✅ **DO** lazy load routes and modules
- ❌ **DON'T** perform heavy calculations in templates
- ❌ **DON'T** make unnecessary HTTP requests

### 8. Security
- ✅ **DO** validate all user input
- ✅ **DO** use role guards on admin routes
- ✅ **DO** sanitize HTML content
- ✅ **DO** use HTTPS in production
- ❌ **DON'T** expose sensitive data in client code
- ❌ **DON'T** store secrets in environment files committed to git
- ❌ **DON'T** trust client-side validation alone

### 9. Styling
- ✅ **DO** use Angular Material components
- ✅ **DO** follow Material Design guidelines
- ✅ **DO** use component-scoped styles
- ✅ **DO** use CSS variables for theming
- ❌ **DON'T** use global styles for component-specific styling
- ❌ **DON'T** use inline styles in templates

### 10. Git Commits
- ✅ **DO** use conventional commit messages
- ✅ **DO** write descriptive commit messages
- ✅ **DO** commit related changes together
- ✅ **DO** test before committing
- ❌ **DON'T** commit broken code
- ❌ **DON'T** commit merge conflicts
- ❌ **DON'T** commit node_modules or build artifacts

---

## Quick Reference Checklist

When adding a new resource, ensure you have:

- [ ] Created models with TypeScript interfaces
- [ ] Created enums for fixed value sets
- [ ] Created Zod schemas for validation
- [ ] Created API service extending BaseApiService
- [ ] Created list page component
- [ ] Created create page component
- [ ] Created edit page component
- [ ] Created form component (if needed)
- [ ] Created detail/view page (if needed)
- [ ] Created feature routes file
- [ ] Added routes to main app.routes.ts
- [ ] Added navigation item to navigation component
- [ ] Added route guards for security
- [ ] Written unit tests
- [ ] Updated this guide if patterns changed

---

## Common Commands

```bash
# Start development server
npm start

# Build for production
npm run build:prod

# Run tests
npm test

# Run linting
npm run lint

# Format code
npm run format

# Analyze bundle size
npm run build:stats && npm run analyze

# Build library
npm run build:lib
```

---

## Troubleshooting

### Issue: Route not working after adding new feature
**Solution**: Ensure route is added to `app.routes.ts` and feature routes are exported correctly

### Issue: Form validation not working
**Solution**: Check Zod schema is correctly configured and `ZodValidators.createValidator()` is applied

### Issue: Component not updating when data changes
**Solution**: Ensure using signals and not mutating data directly

### Issue: API calls failing
**Solution**: Check `apiBaseUrl` in environment config and ensure API service extends `BaseApiService` correctly

---

## Resources

- [Angular Documentation](https://angular.dev)
- [Angular Material](https://material.angular.io)
- [Zod Documentation](https://zod.dev)
- [RxJS Documentation](https://rxjs.dev)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)

---

**Last Updated**: 2025-12-10
**Version**: 1.0.0
**Maintainer**: Labyrinth Team
