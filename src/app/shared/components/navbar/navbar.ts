import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthStore } from '../../../features/auth/services/auth-store';
import { RoleEnum } from '../../../features/role/enums/role.enum';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink  , RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.scss']
})
export class Navbar {
  private authStore = inject(AuthStore);
  
  isMenuOpen = signal(false);
  isAuthenticated = this.authStore.isAuthenticated;
  currentUser = this.authStore.currentUser;

  toggleMenu(): void {
    this.isMenuOpen.update(value => !value);
  }

  closeMenu(): void {
    this.isMenuOpen.set(false);
  }

  logout(): void {
    this.authStore.logout().subscribe(() => {
      this.closeMenu();
    });
  }

  isAdmin() {
    return this.currentUser()?.roles?.some(r => r.name === RoleEnum.ADMIN) ?? false;
  }
}