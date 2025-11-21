import { Component, input, output, effect, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Role } from '../../models/role.model';

@Component({
  selector: 'app-role-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './role-form.html',
  styleUrls: ['./role-form.scss']
})
export class RoleForm {
  // Inputs
  role = input<Role | null>(null);
  isEditMode = input<boolean>(false);
  isLoading = input<boolean>(false);

  // Outputs
  formSubmit = output<Partial<Role>>();
  formCancel = output<void>();

  roleForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.roleForm = this.createForm();

    // Effect to populate form when role changes
    effect(() => {
      const roleData = this.role();
      if (roleData) {
        this.populateForm(roleData);
      }
    });
  }

  private createForm(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      description: [''],
      isActive: [true]
    });
  }

  private populateForm(role: Role): void {
    this.roleForm.patchValue({
      name: role.name,
      description: role.description || '',
      isActive: role.isActive ?? true
    });
  }

  onSubmit(): void {
    if (this.roleForm.invalid) {
      this.roleForm.markAllAsTouched();
      return;
    }

    const formData: Partial<Role> = {
      name: this.roleForm.value.name,
      description: this.roleForm.value.description,
      isActive: this.roleForm.value.isActive
    };

    this.formSubmit.emit(formData);
  }

  onCancel(): void {
    this.formCancel.emit();
  }

  getFieldError(fieldName: string): string {
    const field = this.roleForm.get(fieldName);
    if (field?.touched && field?.errors) {
      if (field.errors['required']) return 'This field is required';
      if (field.errors['minlength']) return `Minimum ${field.errors['minlength'].requiredLength} characters`;
    }
    return '';
  }
}