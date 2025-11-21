import { Routes } from '@angular/router';
import { MainLayout } from '../../layouts/main-layout/main-layout';

export const ROLE_ROUTES: Routes = [
  {
    path: '',
    component: MainLayout,
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/role-list/role-list').then(m => m.RoleList)
      },
      {
        path: 'create',
        loadComponent: () => import('./pages/role-create/role-create').then(m => m.RoleCreate)
      },
      {
        path: ':id/edit',
        loadComponent: () => import('./pages/role-edit/role-edit').then(m => m.RoleEdit)
      }
    ]
  }
];