import { Routes } from '@angular/router';
import { MainLayout } from '../../layouts/main-layout/main-layout';

export const USER_ROUTES: Routes = [
  {
    path: '',
    component: MainLayout,
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/user-list/user-list').then(m => m.UserList)
      },
      {
        path: ':id/edit',
        loadComponent: () => import('./pages/user-edit/user-edit').then(m => m.UserEdit)
      },
      {
        path: 'create',
        loadComponent: () => import('./pages/user-create/user-create').then(m => m.UserCreate)
      }
    ]
  }
];