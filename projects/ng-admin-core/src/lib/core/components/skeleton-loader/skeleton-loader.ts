import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Skeleton loader component for displaying loading placeholders.
 * Useful for showing loading states in tables and lists.
 *
 * @example
 * ```html
 * <!-- Show 5 table row skeletons with 4 columns -->
 * <lb-skeleton-loader [rows]="5" [columns]="4" type="table" />
 *
 * <!-- Show 3 card skeletons -->
 * <lb-skeleton-loader [rows]="3" type="card" />
 * ```
 */
@Component({
  selector: 'lb-skeleton-loader',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './skeleton-loader.html',
  styleUrls: ['./skeleton-loader.scss']
})
export class SkeletonLoader {
  /**
   * Number of skeleton rows to display
   */
  rows = input<number>(3);

  /**
   * Number of skeleton columns to display (for table type)
   */
  columns = input<number>(4);

  /**
   * Type of skeleton to display
   * - 'table': Table row skeletons with columns
   * - 'card': Card skeletons
   * - 'list': Simple list item skeletons
   */
  type = input<'table' | 'card' | 'list'>('table');

  /**
   * Height of each skeleton row in pixels
   */
  height = input<number>(48);

  /**
   * Creates an array for iteration in template
   */
  getArray(count: number): number[] {
    return Array(count).fill(0).map((_, i) => i);
  }
}
