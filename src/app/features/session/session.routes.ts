import { Routes } from '@angular/router';

export const SESSION_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/sessions/sessions').then(m => m.Sessions)
  }
];