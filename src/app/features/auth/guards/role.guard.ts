import { CanActivateFn, Router } from "@angular/router";
import { AuthStore } from "../services/auth-store";
import { inject } from "@angular/core";

export function roleGuard(allowedRoles: string[]): CanActivateFn {
    return (route, state) => {
        const authStore = inject(AuthStore);
        const router = inject(Router);

        if (!authStore.isAuthenticated()) {
            router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
            return false;
        }

        const hasRequiredRole = allowedRoles.some(role => authStore.hasRole(role));

        if (!hasRequiredRole) {
            router.navigate(['/unauthorized']);
            return false;
        }

        return true;
    };
}