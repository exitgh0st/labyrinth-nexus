import { inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ADMIN_CORE_CONFIG } from '../config/tokens';
import { ListResponse } from '../interfaces/list-response';
import { ListQuery } from '../interfaces/list-query';

/**
 * Abstract base class for API services providing common CRUD operations.
 * Eliminates code duplication across feature API services.
 *
 * @typeParam T - The entity type this service manages
 * @typeParam ID - The type of the entity's identifier (defaults to number)
 *
 * @example
 * ```typescript
 * @Injectable({
 *   providedIn: 'root'
 * })
 * export class UserApi extends BaseApiService<User, string> {
 *   protected resourcePath = 'users';
 *
 *   // Add custom methods here
 * }
 * ```
 */
export abstract class BaseApiService<T, ID = number> {
  protected http = inject(HttpClient);
  protected config = inject(ADMIN_CORE_CONFIG);
  protected apiUrl = this.config.apiBaseUrl;

  /**
   * The resource path for this API (e.g., 'users', 'roles')
   * Must be defined by subclasses
   */
  protected abstract resourcePath: string;

  /**
   * Constructs the full URL for API requests
   * @param id - Optional entity ID to append to the URL
   * @returns Full URL for the resource
   */
  protected getResourceUrl(id?: ID): string {
    const base = `${this.apiUrl}/${this.resourcePath}`;
    return id !== undefined ? `${base}/${id}` : base;
  }

  /**
   * Builds HttpParams from a query object, filtering out undefined values
   * @param query - Query parameters object
   * @returns HttpParams instance
   */
  protected buildParams(query?: Record<string, any>): HttpParams {
    let params = new HttpParams();

    if (query) {
      Object.keys(query).forEach(key => {
        const value = query[key];
        if (value !== undefined && value !== null) {
          params = params.set(key, value.toString());
        }
      });
    }

    return params;
  }

  /**
   * Retrieves a paginated list of entities
   * @param query - Optional query parameters for filtering, sorting, and pagination
   * @returns Observable of ListResponse containing entities and total count
   */
  getAll(query?: ListQuery): Observable<ListResponse<T>> {
    const params = this.buildParams(query);

    return this.http.get<ListResponse<T>>(
      this.getResourceUrl(),
      { params, withCredentials: true }
    );
  }

  /**
   * Retrieves a single entity by ID
   * @param id - The entity identifier
   * @returns Observable of the entity
   */
  getById(id: ID): Observable<T> {
    return this.http.get<T>(
      this.getResourceUrl(id),
      { withCredentials: true }
    );
  }

  /**
   * Creates a new entity
   * @param data - Partial entity data for creation
   * @returns Observable of the created entity
   */
  create(data: Partial<T>): Observable<T> {
    return this.http.post<T>(
      this.getResourceUrl(),
      data,
      { withCredentials: true }
    );
  }

  /**
   * Updates an existing entity
   * @param id - The entity identifier
   * @param data - Partial entity data to update
   * @returns Observable of the updated entity
   */
  update(id: ID, data: Partial<T>): Observable<T> {
    return this.http.patch<T>(
      this.getResourceUrl(id),
      data,
      { withCredentials: true }
    );
  }

  /**
   * Deletes an entity
   * @param id - The entity identifier
   * @returns Observable that completes when deletion is successful
   */
  delete(id: ID): Observable<void> {
    return this.http.delete<void>(
      this.getResourceUrl(id),
      { withCredentials: true }
    );
  }
}
