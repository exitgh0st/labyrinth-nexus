import { CanActivateFn, Router } from "@angular/router";
import { AuthStore } from "../services/auth-store";
import { inject } from "@angular/core";

export const guestGuard: CanActivateFn = () => {
    const authStore = inject(AuthStore);
    const router = inject(Router);

    if (authStore.isAuthenticated()) {
        router.navigate(['/home']);
        return false;
    }

    return true;
};