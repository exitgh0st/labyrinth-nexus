import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

/**
 * Empty state component for displaying when no data is available.
 * Provides a user-friendly message and optional action button.
 *
 * @example
 * ```html
 * <lb-empty-state
 *   icon="people"
 *   title="No users found"
 *   message="Get started by creating your first user"
 *   actionText="Create User"
 *   (action)="createUser()"
 * />
 * ```
 */
@Component({
  selector: 'lb-empty-state',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  templateUrl: './empty-state.html',
  styleUrls: ['./empty-state.scss']
})
export class EmptyState {
  /**
   * Material icon name to display
   */
  icon = input<string>('inbox');

  /**
   * Title text to display
   */
  title = input<string>('No data available');

  /**
   * Message text to display below the title
   */
  message = input<string>('');

  /**
   * Optional action button text
   * If not provided, button will not be shown
   */
  actionText = input<string>('');

  /**
   * Emitted when the action button is clicked
   */
  action = output<void>();

  /**
   * Size of the empty state display
   */
  size = input<'small' | 'medium' | 'large'>('medium');

  onActionClick(): void {
    this.action.emit();
  }
}
