/**
 * Permission-based rendering directive
 * @module auth/directives
 */

import {
  Directive,
  Input,
  TemplateRef,
  ViewContainerRef,
  inject,
  effect,
  signal,
} from '@angular/core';
import { PermissionService } from '../services/permission.service';

/**
 * Structural directive for conditional rendering based on permissions
 *
 * @example
 * ```html
 * <!-- Show only if user has 'admin' role -->
 * <button *can="{ roles: ['admin'] }">Delete User</button>
 *
 * <!-- Show only if user has 'users:create' permission -->
 * <button *can="{ permissions: ['users:create'] }">Create User</button>
 *
 * <!-- Show if user has 'admin' role OR 'users:edit' permission -->
 * <button *can="{ roles: ['admin'], permissions: ['users:edit'] }">Edit User</button>
 *
 * <!-- Show if user has 'admin' role AND 'users:delete' permission -->
 * <button *can="{ roles: ['admin'], permissions: ['users:delete'], requireAll: true }">
 *   Delete User
 * </button>
 *
 * <!-- Show alternative content if user doesn't have permission -->
 * <div *can="{ roles: ['admin'] }; else notAdmin">
 *   <p>Admin content</p>
 * </div>
 * <ng-template #notAdmin>
 *   <p>You don't have permission to view this</p>
 * </ng-template>
 * ```
 */
@Directive({
  selector: '[can]',
  standalone: true,
})
export class CanDirective {
  private templateRef = inject(TemplateRef<any>);
  private viewContainer = inject(ViewContainerRef);
  private permissionService = inject(PermissionService);

  private requirements = signal<{
    roles?: string[];
    permissions?: string[];
    requireAll?: boolean;
  }>({});

  private elseTemplate = signal<TemplateRef<any> | null>(null);
  private hasView = false;

  constructor() {
    // Automatically update view when requirements or user permissions change
    effect(() => {
      const reqs = this.requirements();
      const hasPermission = this.permissionService.can(
        {
          roles: reqs.roles,
          permissions: reqs.permissions,
        },
        { requireAll: reqs.requireAll }
      );

      this.updateView(hasPermission);
    });
  }

  /**
   * Set permission requirements
   */
  @Input()
  set can(requirements: {
    roles?: string[];
    permissions?: string[];
    requireAll?: boolean;
  }) {
    this.requirements.set(requirements || {});
  }

  /**
   * Set template to render when permission check fails
   */
  @Input()
  set canElse(templateRef: TemplateRef<any> | null) {
    this.elseTemplate.set(templateRef);
  }

  /**
   * Update the view based on permission check result
   */
  private updateView(hasPermission: boolean): void {
    if (hasPermission && !this.hasView) {
      this.viewContainer.clear();
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.hasView = true;
    } else if (!hasPermission && this.hasView) {
      this.viewContainer.clear();
      this.hasView = false;

      const elseTemplate = this.elseTemplate();
      if (elseTemplate) {
        this.viewContainer.createEmbeddedView(elseTemplate);
      }
    } else if (!hasPermission && !this.hasView) {
      const elseTemplate = this.elseTemplate();
      if (elseTemplate && this.viewContainer.length === 0) {
        this.viewContainer.createEmbeddedView(elseTemplate);
      }
    }
  }
}


/**
 * Inverse of Can directive - shows content when user DOESN'T have permission
 *
 * @example
 * ```html
 * <!-- Show only if user is NOT an admin -->
 * <div *cannot="{ roles: ['admin'] }">
 *   <p>Regular user content</p>
 * </div>
 * ```
 */
@Directive({
  selector: '[cannot]',
  standalone: true,
})
export class CannotDirective {
  private templateRef = inject(TemplateRef<any>);
  private viewContainer = inject(ViewContainerRef);
  private permissionService = inject(PermissionService);

  private requirements = signal<{
    roles?: string[];
    permissions?: string[];
    requireAll?: boolean;
  }>({});

  private hasView = false;

  constructor() {
    effect(() => {
      const reqs = this.requirements();
      const hasPermission = this.permissionService.can(
        {
          roles: reqs.roles,
          permissions: reqs.permissions,
        },
        { requireAll: reqs.requireAll }
      );

      this.updateView(!hasPermission);
    });
  }

  @Input()
  set cannot(requirements: {
    roles?: string[];
    permissions?: string[];
    requireAll?: boolean;
  }) {
    this.requirements.set(requirements || {});
  }

  private updateView(shouldShow: boolean): void {
    if (shouldShow && !this.hasView) {
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.hasView = true;
    } else if (!shouldShow && this.hasView) {
      this.viewContainer.clear();
      this.hasView = false;
    }
  }
}
