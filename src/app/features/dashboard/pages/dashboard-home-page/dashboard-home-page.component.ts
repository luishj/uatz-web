import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { BudgetRequestsService } from '../../../../core/services/budget-requests.service';
import { BudgetRequest } from '../../../../core/models/budget-request.models';
import { formatDateTime, getBudgetRequestStatusClass, translateBudgetRequestStatus } from '../../../../shared/utils/formatters';

@Component({
  selector: 'uatz-dashboard-home-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard-home-page.component.html',
  styleUrl: './dashboard-home-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardHomePageComponent {
  private readonly budgetRequestsService = inject(BudgetRequestsService);

  readonly isLoading = signal(true);
  readonly requests = signal<BudgetRequest[]>([]);

  readonly totalRequests = computed(() => this.requests().length);
  readonly openRequests = computed(() => this.requests().filter((request) => request.status === 'OPEN').length);
  readonly waitingQuotes = computed(() =>
    this.requests().filter((request) => request.status === 'WAITING_QUOTES').length
  );
  readonly latestRequests = computed(() => this.requests().slice(0, 5));

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
        next: (requests) => this.requests.set(this.sortRequests(requests)),
        error: () => this.requests.set([])
      });
  }

  private sortRequests(requests: BudgetRequest[]) {
    return [...requests].sort((left, right) => right.createdAt.localeCompare(left.createdAt));
  }
}
