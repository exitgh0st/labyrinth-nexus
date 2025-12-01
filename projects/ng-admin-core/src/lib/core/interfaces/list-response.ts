/**
 * Generic list response interface for paginated data
 * @module interfaces
 */

/**
 * Standard response format for list/paginated endpoints
 *
 * @example
 * ```typescript
 * interface User {
 *   id: string;
 *   name: string;
 * }
 *
 * const response: ListResponse<User> = {
 *   data: [{ id: '1', name: 'John' }],
 *   total: 100
 * };
 * ```
 */
export interface ListResponse<T> {
  /** Array of items */
  data: T[];
  /** Total count of items (for pagination) */
  total: number;
}
