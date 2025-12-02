import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Role } from '../models/role.model';
import { ListQuery, ListResponse, BaseApiService } from '@labyrinth/ng-admin-core';

/**
 * Extended query interface for role filtering
 */
export interface RoleListQuery extends ListQuery {
  isActive?: boolean;
}

/**
 * Role API service extending BaseApiService for CRUD operations
 */
@Injectable({
  providedIn: 'root'
})
export class RoleApi extends BaseApiService<Role, number> {
  protected override resourcePath = 'roles';

  /**
   * Override getAll to support role-specific filtering
   */
  override getAll(query?: RoleListQuery): Observable<ListResponse<Role>> {
    let params = new HttpParams();

    if (query?.skip !== undefined) {
      params = params.set('skip', query.skip.toString());
    }
    if (query?.take !== undefined) {
      params = params.set('take', query.take.toString());
    }
    if (query?.isActive !== undefined) {
      params = params.set('isActive', query.isActive.toString());
    }

    return this.http.get<ListResponse<Role>>(
      this.getResourceUrl(),
      { params, withCredentials: true }
    );
  }

  /**
   * Legacy method for backward compatibility
   * @deprecated Use getAll instead
   */
  getRoles(query?: RoleListQuery): Observable<ListResponse<Role>> {
    return this.getAll(query);
  }

  /**
   * Legacy method for backward compatibility
   * @deprecated Use getById instead
   */
  getRoleById(id: number): Observable<Role> {
    return this.getById(id);
  }

  /**
   * Legacy method for backward compatibility
   * @deprecated Use create instead
   */
  createRole(role: Partial<Role>): Observable<Role> {
    return this.create(role);
  }

  /**
   * Legacy method for backward compatibility
   * @deprecated Use update instead
   */
  updateRole(id: number, role: Partial<Role>): Observable<Role> {
    return this.update(id, role);
  }

  /**
   * Legacy method for backward compatibility
   * @deprecated Use delete instead
   */
  deleteRole(id: number): Observable<void> {
    return this.delete(id);
  }
}