import { Component, effect, inject, signal } from '@angular/core';
import { AuthStore } from '../../../auth/services/auth-store';
import { takeWhile, timer } from 'rxjs';

@Component({
  selector: 'app-session-timeout-warning',
  imports: [],
  templateUrl: './session-timeout-warning.html',
  styleUrl: './session-timeout-warning.scss',
})
export class SessionTimeoutWarning {
  private authStore = inject(AuthStore);

  showWarning = signal(false);
  timeRemaining = signal(0);

  private readonly WARNING_THRESHOLD_MS = 5 * 60 * 1000; // Show warning 5 min before timeout
  private readonly INACTIVITY_TIMEOUT_MS = 30 * 60 * 1000; // 30 min total

  constructor() {
    effect(() => {
      if (this.authStore.isAuthenticated()) {
        this.startWatchdog();
      }
    });
  }

  private startWatchdog(): void {
    timer(this.INACTIVITY_TIMEOUT_MS - this.WARNING_THRESHOLD_MS).subscribe(() => {
      this.showWarning.set(true);
      this.startCountdown();
    });
  }

  private startCountdown(): void {
    let remaining = Math.floor(this.WARNING_THRESHOLD_MS / 1000);
    this.timeRemaining.set(remaining);

    const countdown$ = timer(0, 1000).pipe(
      takeWhile(() => remaining > 0 && this.showWarning())
    );

    countdown$.subscribe(() => {
      remaining--;
      this.timeRemaining.set(remaining);
      
      if (remaining === 0) {
        this.authStore.logout().subscribe();
      }
    });
  }

  extendSession(): void {
    this.showWarning.set(false);
    this.authStore.recordActivity();
  }

  logoutNow(): void {
    this.authStore.logout().subscribe();
  }
}
