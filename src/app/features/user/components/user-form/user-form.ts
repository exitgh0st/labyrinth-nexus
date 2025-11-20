import { Component, input, output, effect, signal, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { User } from '../../models/user.model';
import { Role } from '../../../role/models/role.model';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-form.html',
  styleUrls: ['./user-form.scss']
})
export class UserForm {
  // Inputs
  user = input<User | null>(null);
  availableRoles = input<Role[]>([]);
  isEditMode = input<boolean>(false);
  isLoading = input<boolean>(false);

  // Outputs
  formSubmit = output<Partial<User>>();
  formCancel = output<void>();

  userForm: FormGroup;
  selectedRoles = signal<Role[]>([]);
  isDropdownOpen = signal<boolean>(false);

  constructor(private fb: FormBuilder) {
    this.userForm = this.createForm();

    // Effect to populate form when user changes
    effect(() => {
      const userData = this.user();
      if (userData) {
        this.populateForm(userData);
      }
    });
  }

  private createForm(): FormGroup {
    return this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      firstName: [''],
      lastName: [''],
      displayName: [''],
      avatarUrl: [''],
      isActive: [true],
      password: [''],
      confirmPassword: ['']
    });
  }

  private populateForm(user: User): void {
    this.userForm.patchValue({
      email: user.email,
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      displayName: user.displayName || '',
      avatarUrl: user.avatarUrl || '',
      isActive: user.isActive
    });

    // Set selected roles - map to Role objects
    if (user.roles) {
      this.selectedRoles.set(user.roles);
    }

    // Remove password validators in edit mode
    if (this.isEditMode()) {
      this.userForm.get('password')?.clearValidators();
      this.userForm.get('confirmPassword')?.clearValidators();
    } else {
      this.userForm.get('password')?.setValidators([Validators.required, Validators.minLength(8)]);
      this.userForm.get('confirmPassword')?.setValidators([Validators.required]);
    }

    this.userForm.get('password')?.updateValueAndValidity();
    this.userForm.get('confirmPassword')?.updateValueAndValidity();
  }

  toggleDropdown(): void {
    this.isDropdownOpen.set(!this.isDropdownOpen());
  }

  closeDropdown(): void {
    this.isDropdownOpen.set(false);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const dropdown = target.closest('.custom-multi-select');

    if (!dropdown && this.isDropdownOpen()) {
      this.closeDropdown();
    }
  }

  toggleRole(role: Role, event?: Event): void {
    if (event) {
      event.stopPropagation();
    }

    const current = this.selectedRoles();
    const index = current.findIndex(r => r.id === role.id);

    if (index > -1) {
      this.selectedRoles.set(current.filter(r => r.id !== role.id));
    } else {
      this.selectedRoles.set([...current, role]);
    }
  }

  removeRole(roleId: number): void {
    const current = this.selectedRoles();
    this.selectedRoles.set(current.filter(r => r.id !== roleId));
  }

  isRoleSelected(roleId: number): boolean {
    return this.selectedRoles().some(r => r.id === roleId);
  }

  onSubmit(): void {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    const password = this.userForm.value.password;
    const confirmPassword = this.userForm.value.confirmPassword;

    if (!this.isEditMode() && password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    if (this.isEditMode() && password && password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    const formData: Partial<User> = {
      email: this.userForm.value.email,
      firstName: this.userForm.value.firstName,
      lastName: this.userForm.value.lastName,
      displayName: this.userForm.value.displayName,
      avatarUrl: this.userForm.value.avatarUrl,
      isActive: this.userForm.value.isActive,
    };

    if (password) {
      formData.password = password;
    }

    if (this.selectedRoles().length > 0) {
      console.log("FA", this.selectedRoles);
      formData.roleIds = this.selectedRoles().map(r => r.id);
    }

    console.log(formData);
    this.formSubmit.emit(formData);
  }

  onCancel(): void {
    this.formCancel.emit();
  }

  getFieldError(fieldName: string): string {
    const field = this.userForm.get(fieldName);
    if (field?.touched && field?.errors) {
      if (field.errors['required']) return 'This field is required';
      if (field.errors['email']) return 'Invalid email format';
      if (field.errors['minlength']) return `Minimum ${field.errors['minlength'].requiredLength} characters`;
    }
    return '';
  }
}