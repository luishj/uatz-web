import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { VendorsService } from '../../../../core/services/vendors.service';
import { Vendor } from '../../../../core/models/vendor.models';

@Component({
  selector: 'uatz-vendors-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './vendors-page.component.html',
  styleUrl: './vendors-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VendorsPageComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly vendorsService = inject(VendorsService);

  readonly isLoading = signal(true);
  readonly isSubmitting = signal(false);
  readonly hasError = signal(false);
  readonly successMessage = signal('');
  readonly errorMessage = signal('');
  readonly editingVendorId = signal<number | null>(null);
  readonly vendors = signal<Vendor[]>([]);

  readonly form = this.formBuilder.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(150)]],
    phone: ['', [Validators.required, Validators.maxLength(30)]],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(150)]],
    password: ['', [Validators.minLength(6), Validators.maxLength(100)]],
    city: ['', [Validators.maxLength(120)]],
    state: ['', [Validators.maxLength(60)]],
    active: [true]
  });

  constructor() {
    this.loadVendors();
  }

  submit() {
    if (this.form.invalid || this.isSubmitting()) {
      this.form.markAllAsTouched();
      return;
    }

    this.errorMessage.set('');
    this.successMessage.set('');
    this.isSubmitting.set(true);

    const value = this.form.getRawValue();
    const editingVendorId = this.editingVendorId();

    if (!editingVendorId && !value.password.trim()) {
      this.isSubmitting.set(false);
      this.errorMessage.set('Senha de acesso obrigatoria no cadastro do fornecedor.');
      return;
    }

    const payload = {
      name: value.name.trim(),
      phone: value.phone.trim(),
      email: value.email.trim() || null,
      password: value.password.trim() || null,
      city: value.city.trim() || null,
      state: value.state.trim() || null,
      active: value.active
    };

    const request$ = editingVendorId
      ? this.vendorsService.update(editingVendorId, payload)
      : this.vendorsService.create(payload);

    request$
      .pipe(finalize(() => this.isSubmitting.set(false)))
      .subscribe({
        next: (vendor) => {
          this.vendors.update((vendors) => {
            const hasVendor = vendors.some((currentVendor) => currentVendor.id === vendor.id);
            const nextVendors = hasVendor
              ? vendors.map((currentVendor) => (currentVendor.id === vendor.id ? vendor : currentVendor))
              : [vendor, ...vendors];

            return [...nextVendors].sort((left, right) => left.name.localeCompare(right.name));
          });
          this.successMessage.set(
            editingVendorId ? 'Fornecedor atualizado com sucesso.' : 'Fornecedor cadastrado com sucesso.'
          );
          this.resetForm();
        },
        error: () => this.errorMessage.set('Nao foi possivel cadastrar o fornecedor.')
      });
  }

  startEdit(vendor: Vendor) {
    this.errorMessage.set('');
    this.successMessage.set('');
    this.editingVendorId.set(vendor.id);
    this.form.setValue({
      name: vendor.name,
      phone: vendor.phone,
      email: vendor.email ?? '',
      password: '',
      city: vendor.city ?? '',
      state: vendor.state ?? '',
      active: vendor.active ?? true
    });
  }

  cancelEdit() {
    this.resetForm();
  }

  toggleActive(vendor: Vendor) {
    this.errorMessage.set('');
    this.successMessage.set('');

    this.vendorsService
      .update(vendor.id, {
        name: vendor.name,
        phone: vendor.phone,
        email: vendor.email,
        password: null,
        city: vendor.city,
        state: vendor.state,
        active: !vendor.active
      })
      .subscribe({
        next: (updatedVendor) => {
          this.vendors.update((vendors) =>
            vendors.map((currentVendor) => (currentVendor.id === updatedVendor.id ? updatedVendor : currentVendor))
          );
          this.successMessage.set(updatedVendor.active ? 'Fornecedor reativado.' : 'Fornecedor inativado.');

          if (this.editingVendorId() === updatedVendor.id) {
            this.startEdit(updatedVendor);
          }
        },
        error: () => this.errorMessage.set('Nao foi possivel atualizar o status do fornecedor.')
      });
  }

  private loadVendors() {
    this.vendorsService
      .findAllForAdmin()
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (vendors) => this.vendors.set([...vendors].sort((left, right) => left.name.localeCompare(right.name))),
        error: () => this.hasError.set(true)
      });
  }

  private resetForm() {
    this.editingVendorId.set(null);
    this.form.reset({
      name: '',
      phone: '',
      email: '',
      password: '',
      city: '',
      state: '',
      active: true
    });
  }
}
