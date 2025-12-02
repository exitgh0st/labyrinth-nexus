import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { AuthService } from 'ng-admin-core';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatDividerModule,
    MatChipsModule,
  ],
  templateUrl: './profile.html',
  styleUrl: './profile.scss'
})
export class Profile {
  private fb = inject(FormBuilder);
  protected authService = inject(AuthService);

  isEditing = signal(false);
  isSaving = signal(false);

  user = computed(() => this.authService.user());

  profileForm: FormGroup = this.fb.group({
    firstName: ['', [Validators.required, Validators.minLength(2)]],
    lastName: ['', [Validators.required, Validators.minLength(2)]],
    email: [{ value: '', disabled: true }, [Validators.required, Validators.email]],
    phone: [''],
  });

  passwordForm: FormGroup = this.fb.group({
    currentPassword: ['', [Validators.required, Validators.minLength(8)]],
    newPassword: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', [Validators.required]],
  });

  userRoles = computed(() => {
    const user = this.user();
    return user?.roles?.map(r => r.name) || [];
  });

  userPermissions = computed(() => {
    const user = this.user();
    const rolePermissions = user?.roles?.flatMap(r => r.permissions || []) || [];
    const directPermissions = user?.permissions || [];
    const allPermissions = [...rolePermissions, ...directPermissions];

    // Remove duplicates
    const uniquePermissions = Array.from(
      new Set(allPermissions.map(p => p.name))
    );

    return uniquePermissions;
  });

  accountAge = computed(() => {
    const user = this.user();
    if (!user?.createdAt) return 'Unknown';

    const created = new Date(user.createdAt);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - created.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 30) return `${diffDays} days`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months`;
    return `${Math.floor(diffDays / 365)} years`;
  });

  ngOnInit(): void {
    this.loadUserData();
  }

  loadUserData(): void {
    const user = this.user();
    if (user) {
      this.profileForm.patchValue({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
      });
    }
  }

  toggleEdit(): void {
    if (this.isEditing()) {
      this.loadUserData(); // Reset form
    }
    this.isEditing.update(v => !v);
  }

  saveProfile(): void {
    if (this.profileForm.invalid) {
      Object.keys(this.profileForm.controls).forEach(key => {
        this.profileForm.controls[key].markAsTouched();
      });
      return;
    }

    this.isSaving.set(true);

    // Simulate API call
    setTimeout(() => {
      const formValue = this.profileForm.getRawValue();
      console.log('Saving profile:', formValue);

      // Update auth service user
      this.authService.updateUser({
        firstName: formValue.firstName,
        lastName: formValue.lastName,
        phone: formValue.phone,
      });

      this.isSaving.set(false);
      this.isEditing.set(false);
    }, 1000);
  }

  changePassword(): void {
    if (this.passwordForm.invalid) {
      Object.keys(this.passwordForm.controls).forEach(key => {
        this.passwordForm.controls[key].markAsTouched();
      });
      return;
    }

    const { newPassword, confirmPassword } = this.passwordForm.value;
    if (newPassword !== confirmPassword) {
      this.passwordForm.controls['confirmPassword'].setErrors({ mismatch: true });
      return;
    }

    console.log('Changing password...');
    // Implement password change logic
    this.passwordForm.reset();
  }

  getErrorMessage(form: FormGroup, field: string): string {
    const control = form.get(field);
    if (!control || !control.errors || !control.touched) return '';

    if (control.errors['required']) return `${field} is required`;
    if (control.errors['email']) return 'Invalid email address';
    if (control.errors['minlength']) {
      return `Minimum ${control.errors['minlength'].requiredLength} characters required`;
    }
    if (control.errors['mismatch']) return 'Passwords do not match';

    return 'Invalid input';
  }
}
