import { Routes } from '@angular/router';

export const USER_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/user-list/user-list').then(m => m.UserList)
  },
  {
    path: 'create',
    loadComponent: () => import('./pages/user-create/user-create').then(m => m.UserCreate)
  },
  {
    path: ':id',
    loadComponent: () => import('./pages/user-details/user-details').then(m => m.UserDetails)
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./pages/user-edit/user-edit').then(m => m.UserEdit)
  }
];