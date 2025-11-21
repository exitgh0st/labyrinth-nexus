import { Routes } from '@angular/router';
import { authGuard } from './features/auth/guards/auth.guard';
import { guestGuard } from './features/auth/guards/guest.guard';
import { roleGuard } from './features/auth/guards/role.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    path: '',
    loadChildren: () => import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES),
    canActivate: [guestGuard]
  },
  {
    path: 'home',
    loadChildren: () => import('./features/home/home.routes').then(m => m.HOME_ROUTES),
    canActivate: [authGuard]
  },
  {
    path: 'users',
    loadChildren: () => import('./features/user/user.routes').then(m => m.USER_ROUTES),
    canActivate: [authGuard, roleGuard(['ADMIN'])]
  },
  {
    path: 'roles',
    loadChildren: () => import('./features/role/role.routes').then(m => m.ROLE_ROUTES),
    canActivate: [authGuard, roleGuard(['ADMIN'])]
  },
  {
    path: '**',
    redirectTo: '/home'
  }
];