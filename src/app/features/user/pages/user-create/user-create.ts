import { Component, inject, PLATFORM_ID, signal } from '@angular/core';
import { Role } from '../../../role/models/role.model';
import { UserApi } from '../../services/user-api';
import { User } from '../../models/user.model';
import { Router } from '@angular/router';
import { RoleApi } from '../../../role/services/role-api';
import { UserForm } from '../../components/user-form/user-form';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-user-create',
  imports: [UserForm],
  templateUrl: './user-create.html',
  styleUrl: './user-create.scss',
})
export class UserCreate {
  platformId = inject(PLATFORM_ID);

  availableRoles = signal<Role[]>([]);
  isLoading = signal(false);

  constructor(
    private userApi: UserApi,
    private roleApi: RoleApi,
    private router: Router
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.loadRoles();
    }
  }

  loadRoles() {
    this.roleApi.getRoles().subscribe({
      next: (response) => {
        this.availableRoles.set(response.data || []);
      },
      error: (error) => {
        console.error('Failed to load roles:', error);
      }
    });
  }

  handleCreate(userData: Partial<User>) {
    this.isLoading.set(true);
    this.userApi.createUser(userData).subscribe({
      next: (newUser: User) => {
        console.log('User created:', newUser);
        this.router.navigate(['/users', newUser.id]);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Failed to create user:', error);
        alert('Failed to create user. Please try again.');
        this.isLoading.set(false);
      }
    });
  }

  handleCancel(): void {
    this.router.navigate(['/users']);
  }
}
