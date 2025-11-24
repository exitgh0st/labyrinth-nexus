import { Component, inject, Input } from '@angular/core';
import { OAuthStore } from '../../services/oauth-store';

@Component({
  selector: 'app-google-signin',
  imports: [],
  templateUrl: './google-signin.html',
  styleUrl: './google-signin.scss',
})
export class GoogleSignin {
  private oauthStore = inject(OAuthStore);
  
  @Input() isLoading = false;
  @Input() returnUrl = '/home';

  signInWithGoogle(): void {
    this.oauthStore.initiateGoogleAuth(this.returnUrl);
  }
}
