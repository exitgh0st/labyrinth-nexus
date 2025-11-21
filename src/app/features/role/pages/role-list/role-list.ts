import { Component, OnInit, PLATFORM_ID, inject, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { Role } from '../../models/role.model';
import { RoleApi } from '../../services/role-api';
import Swal from 'sweetalert2';
import { isPlatformBrowser } from '@angular/common';
import { ListQuery } from '../../../../shared/interfaces/list-query';

@Component({
  selector: 'app-role-list',
  standalone: true,
  templateUrl: './role-list.html',
  styleUrl: './role-list.scss'
})
export class RoleList implements OnInit {
  private roleApi = inject(RoleApi);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);

  // Signals for reactive state
  roles = signal<Role[]>([]);
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
      this.loadRoles();
    }
  }

  loadRoles(): void {
    this.loading.set(true);
    this.error.set('');

    this.roleApi.getRoles(this.query).subscribe({
      next: (response) => {
        this.roles.set(response.data);
        this.total.set(response.total);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Failed to load roles');
        this.loading.set(false);
        console.error(err);
      }
    });
  }

  createRole(): void {
    this.router.navigate(['/roles/create']);
  }

  editRole(id: number): void {
    this.router.navigate(['/roles', id, 'edit']);
  }

  deleteRole(id: number): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you really want to delete this role?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete',
      cancelButtonText: 'Cancel',
      heightAuto: false
    }).then(result => {
      if (result.isConfirmed) {
        this.roleApi.deleteRole(id).subscribe({
          next: () => {
            Swal.fire({
              title: 'Deleted!',
              text: 'Role has been deleted.',
              icon: 'success',
              timer: 1500,
              showConfirmButton: false,
              heightAuto: false
            });
            this.loadRoles();
          },
          error: (err) => {
            this.error.set('Failed to delete role');
            console.error(err);
            Swal.fire({
              title: 'Error!',
              text: 'Failed to delete role. Please try again.',
              icon: 'error',
              heightAuto: false
            });
          }
        });
      }
    });
  }

  nextPage(): void {
    if (this.query.skip! + this.query.take! < this.total()) {
      this.query.skip = this.query.skip! + this.query.take!;
      this.loadRoles();
    }
  }

  previousPage(): void {
    if (this.query.skip! > 0) {
      this.query.skip = Math.max(0, this.query.skip! - this.query.take!);
      this.loadRoles();
    }
  }

  formatDate(dateString: Date | string | undefined): string {
    if (!dateString) return 'N/A';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return 'Invalid date';
    }
  }
}