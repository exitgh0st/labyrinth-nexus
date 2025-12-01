/**
 * Generic list query interface for pagination
 * @module interfaces
 */

/**
 * Standard query parameters for list/paginated endpoints
 *
 * @example
 * ```typescript
 * const query: ListQuery = {
 *   skip: 0,
 *   take: 10
 * };
 * ```
 */
export interface ListQuery {
  /** Number of items to skip (offset) */
  skip?: number;
  /** Number of items to take (limit) */
  take?: number;
  /** Optional search query */
  search?: string;
  /** Optional sort field */
  sortBy?: string;
  /** Optional sort order */
  sortOrder?: 'asc' | 'desc';
  /** Optional filters (key-value pairs) */
  filters?: Record<string, any>;
}
