import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from '../../../../core/auth/auth.service';

@Component({
  selector: 'uatz-login-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginPageComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly isSubmitting = signal(false);
  readonly errorMessage = signal('');

  readonly form = this.formBuilder.nonNullable.group({
    email: ['admin@uatz.com', [Validators.required, Validators.email]],
    password: ['123456', [Validators.required, Validators.minLength(6)]]
  });

  submit() {
    if (this.form.invalid || this.isSubmitting()) {
      this.form.markAllAsTouched();
      return;
    }

    this.errorMessage.set('');
    this.isSubmitting.set(true);

    this.authService
      .login(this.form.getRawValue())
      .pipe(finalize(() => this.isSubmitting.set(false)))
      .subscribe({
        next: () => void this.router.navigate(['/']),
        error: () => this.errorMessage.set('Nao foi possivel autenticar. Revise as credenciais e tente novamente.')
      });
  }
}
