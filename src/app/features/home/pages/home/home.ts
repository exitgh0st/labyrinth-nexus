import { Component, inject } from '@angular/core';
import { AuthStore } from '../../../auth/services/auth-store';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  private authStore = inject(AuthStore);
  currentUser = this.authStore.currentUser;
}
