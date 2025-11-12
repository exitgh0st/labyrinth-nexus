import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { User } from '../models/user.model';
import { ListQuery } from '../../../shared/interfaces/list-query';
import { ListResponse } from '../../../shared/interfaces/list-response';

interface UserListQuery extends ListQuery{
  role?: string;
  isActive?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class UserApi {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  getUsers(query?: UserListQuery): Observable<ListResponse<User>> {
    let params = new HttpParams();
    
    if (query?.skip !== undefined) {
      params = params.set('skip', query.skip.toString());
    }
    if (query?.take !== undefined) {
      params = params.set('take', query.take.toString());
    }
    if (query?.role) {
      params = params.set('role', query.role);
    }
    if (query?.isActive !== undefined) {
      params = params.set('isActive', query.isActive.toString());
    }

    return this.http.get<ListResponse<User>>(
      `${this.apiUrl}/users`,
      { params, withCredentials: true }
    );
  }

  getUserById(id: string): Observable<User> {
    return this.http.get<User>(
      `${this.apiUrl}/users/${id}`,
      { withCredentials: true }
    );
  }

  createUser(user: Partial<User>): Observable<User> {
    return this.http.post<User>(
      `${this.apiUrl}/users`,
      user,
      { withCredentials: true }
    );
  }

  updateUser(id: string, user: Partial<User>): Observable<User> {
    return this.http.put<User>(
      `${this.apiUrl}/users/${id}`,
      user,
      { withCredentials: true }
    );
  }

  deleteUser(id: string): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/users/${id}`,
      { withCredentials: true }
    );
  }
}