import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { BudgetRequestsService } from '../../../../core/services/budget-requests.service';
import { BudgetRequest } from '../../../../core/models/budget-request.models';
import { formatDateTime, getBudgetRequestStatusClass, translateBudgetRequestStatus } from '../../../../shared/utils/formatters';

@Component({
  selector: 'uatz-budget-requests-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './budget-requests-page.component.html',
  styleUrl: './budget-requests-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BudgetRequestsPageComponent {
  private readonly budgetRequestsService = inject(BudgetRequestsService);

  readonly isLoading = signal(true);
  readonly hasError = signal(false);
  readonly requests = signal<BudgetRequest[]>([]);
  readonly totalItems = computed(() =>
    this.requests().reduce((sum, request) => sum + request.items.length, 0)
  );

  constructor() {
    this.loadRequests();
  }

  formatDateTime = formatDateTime;
  translateBudgetRequestStatus = translateBudgetRequestStatus;
  getBudgetRequestStatusClass = getBudgetRequestStatusClass;

  private loadRequests() {
    this.budgetRequestsService
      .findAll()
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (requests) => this.requests.set([...requests].sort((a, b) => b.createdAt.localeCompare(a.createdAt))),
        error: () => this.hasError.set(true)
      });
  }
}
