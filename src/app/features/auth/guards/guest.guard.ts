import { CanActivateFn, Router } from "@angular/router";
import { AuthStore } from "../services/auth-store";
import { inject, PLATFORM_ID } from "@angular/core";
import { isPlatformBrowser } from "@angular/common";

export const guestGuard: CanActivateFn = () => {
    const authStore = inject(AuthStore);
    const router = inject(Router);

    const platformId = inject(PLATFORM_ID);

     if (!isPlatformBrowser(platformId)) {
       return true;
     }

    if (authStore.isAuthenticated()) {
        router.navigate(['/home']);
        return false;
    }

    return true;
};