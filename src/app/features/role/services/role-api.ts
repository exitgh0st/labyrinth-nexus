import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Role } from '../models/role.model';
import { ListQuery } from '../../../shared/interfaces/list-query';
import { ListResponse } from '../../../shared/interfaces/list-response';

interface RoleListQuery extends ListQuery {
  isActive?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class RoleApi {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  getRoles(query?: RoleListQuery): Observable<ListResponse<Role>> {
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
      `${this.apiUrl}/roles`,
      { params, withCredentials: true }
    );
  }

  getRoleById(id: number): Observable<Role> {
    return this.http.get<Role>(
      `${this.apiUrl}/roles/${id}`,
      { withCredentials: true }
    );
  }

  createRole(role: Partial<Role>): Observable<Role> {
    return this.http.post<Role>(
      `${this.apiUrl}/roles`,
      role,
      { withCredentials: true }
    );
  }

  updateRole(id: number, role: Partial<Role>): Observable<Role> {
    return this.http.patch<Role>(
      `${this.apiUrl}/roles/${id}`,
      role,
      { withCredentials: true }
    );
  }

  deleteRole(id: number): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/roles/${id}`,
      { withCredentials: true }
    );
  }
}