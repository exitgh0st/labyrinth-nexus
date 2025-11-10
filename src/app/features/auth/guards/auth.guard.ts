import { inject, PLATFORM_ID } from '@angular/core';
import { Router, CanActivateChildFn } from '@angular/router';
import { AuthStore } from '../services/auth-store';
import { isPlatformBrowser } from '@angular/common';

function navigateToLoginPage(router: Router, returnUrl: string): void {
  router.navigate(['/login'], { queryParams: { returnUrl } }).then(() => {
    console.log('Navigated to login page');
  });
}

export const authGuard: CanActivateChildFn = async (route, state) => {
  const authStore = inject(AuthStore);
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  if (!isPlatformBrowser(platformId)) {
    return true;
  }
  
  if (authStore.isAuthenticated()) {
    return true;
  }

  navigateToLoginPage(router, state.url);
  return false;
}


