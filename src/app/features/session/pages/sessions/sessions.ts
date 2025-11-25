import { Component, inject } from '@angular/core';
import { SessionStore } from '../../services/session-store';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-sessions',
  imports: [],
  templateUrl: './sessions.html',
  styleUrl: './sessions.scss',
})
export class Sessions {
  sessionStore = inject(SessionStore);

  ngOnInit(): void {
    this.sessionStore.loadActiveSessions();
  }

  revokeSession(sessionId: number): void {
    Swal.fire({
      title: 'Revoke Session?',
      text: 'This will log out this device.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, revoke',
      heightAuto: false
    }).then(result => {
      if (result.isConfirmed) {
        this.sessionStore.revokeSession(sessionId).subscribe({
          next: () => {
            this.sessionStore.loadActiveSessions();
            Swal.fire('Revoked!', 'Session has been revoked.', 'success');
          },
          error: (error) => {
            Swal.fire('Error', 'Failed to revoke session', 'error');
          }
        });
      }
    });
  }

  logoutAll(): void {
    Swal.fire({
      title: 'Logout All Devices?',
      text: 'You will be logged out from all devices.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, logout all',
      heightAuto: false
    }).then(result => {
      if (result.isConfirmed) {
        this.sessionStore.logoutAllDevices().subscribe({
          next: () => {
            Swal.fire('Success!', 'Logged out from all devices', 'success');
          }
        });
      }
    });
  }

  getDeviceInfo(userAgent?: string): string {
    if (!userAgent) return 'Unknown Device';
    // Simple parser - use ua-parser-js in production
    if (userAgent.includes('Chrome')) return 'Chrome Browser';
    if (userAgent.includes('Firefox')) return 'Firefox Browser';
    if (userAgent.includes('Safari')) return 'Safari Browser';
    return 'Web Browser';
  }

  formatDate(date?: string): string {
    if (!date) return 'Never';
    return new Date(date).toLocaleString();
  }
}
