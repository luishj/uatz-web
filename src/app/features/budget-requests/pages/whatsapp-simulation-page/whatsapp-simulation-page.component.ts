import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { BudgetRequestsService } from '../../../../core/services/budget-requests.service';

@Component({
  selector: 'uatz-whatsapp-simulation-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './whatsapp-simulation-page.component.html',
  styleUrl: './whatsapp-simulation-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WhatsAppSimulationPageComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly budgetRequestsService = inject(BudgetRequestsService);
  private readonly router = inject(Router);

  readonly isSubmitting = signal(false);
  readonly errorMessage = signal('');

  readonly form = this.formBuilder.nonNullable.group({
    phone: ['', [Validators.required, Validators.maxLength(30)]],
    city: [''],
    state: [''],
    message: ['', [Validators.required, Validators.maxLength(4000)]]
  });

  submit() {
    if (this.form.invalid || this.isSubmitting()) {
      this.form.markAllAsTouched();
      return;
    }

    this.errorMessage.set('');
    this.isSubmitting.set(true);

    this.budgetRequestsService.simulateWhatsApp(this.form.getRawValue())
      .pipe(finalize(() => this.isSubmitting.set(false)))
      .subscribe({
        next: (request) => this.router.navigate(['/requests', request.id]),
        error: () => this.errorMessage.set('Nao foi possivel simular a mensagem do WhatsApp.')
      });
  }
}
