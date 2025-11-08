import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthStore } from '../../../features/auth/services/auth-store';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink  , RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.scss']
})
export class Navbar {
  private authStore = inject(AuthStore);
  private router = inject(Router);
  
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
}