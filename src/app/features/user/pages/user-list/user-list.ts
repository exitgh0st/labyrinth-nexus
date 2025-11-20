import { Component, OnInit, PLATFORM_ID, inject, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../../models/user.model';
import { UserApi } from '../../services/user-api';
import Swal from 'sweetalert2';
import { isPlatformBrowser } from '@angular/common';
import { ListQuery } from '../../../../shared/interfaces/list-query';

@Component({
  selector: 'app-user-list',
  standalone: true,
  templateUrl: './user-list.html',
  styleUrl: './user-list.scss'
})
export class UserList implements OnInit {
  private userApi = inject(UserApi);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);

  // Signals for reactive state
  users = signal<User[]>([]);
  total = signal(0);
  loading = signal(false);
  error = signal('');

  query: ListQuery = {
    skip: 0,
    take: 10
  };

  // Computed signals for derived state
  hasNextPage = computed(() => 
    this.query.skip! + this.query.take! < this.total()
  );

  hasPreviousPage = computed(() => 
    this.query.skip! > 0
  );

  currentPage = computed(() => 
    Math.floor(this.query.skip! / this.query.take!) + 1
  );

  totalPages = computed(() => 
    Math.ceil(this.total() / this.query.take!)
  );

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadUsers();
    }
  }

  loadUsers(): void {
    this.loading.set(true);
    this.error.set('');

    this.userApi.getUsers(this.query).subscribe({
      next: (response) => {
        this.users.set(response.data);
        this.total.set(response.total);
        this.loading.set(false);
        console.log(this.users());
      },
      error: (err) => {
        this.error.set('Failed to load users');
        this.loading.set(false);
        console.error(err);
      }
    });
  }

  createUser(): void {
    this.router.navigate(['/users/create']);
  }

  editUser(id: string): void {
    this.router.navigate(['/users', id, 'edit']);
  }

  viewUser(id: string): void {
    this.router.navigate(['/users', id]);
  }

  deleteUser(id: string): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you really want to delete this user?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete',
      cancelButtonText: 'Cancel',
      heightAuto: false
    }).then(result => {
      if (result.isConfirmed) {
        this.userApi.deleteUser(id).subscribe({
          next: () => {
            this.loadUsers();
          },
          error: (err) => {
            this.error.set('Failed to delete user');
            console.error(err);
          }
        });
      }
    });
  }

  nextPage(): void {
    if (this.query.skip! + this.query.take! < this.total()) {
      this.query.skip = this.query.skip! + this.query.take!;
      this.loadUsers();
    }
  }

  previousPage(): void {
    if (this.query.skip! > 0) {
      this.query.skip = Math.max(0, this.query.skip! - this.query.take!);
      this.loadUsers();
    }
  }

  
}