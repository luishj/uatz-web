import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { finalize, forkJoin } from 'rxjs';
import { BudgetRequest } from '../../../../core/models/budget-request.models';
import { Client } from '../../../../core/models/client.models';
import { BudgetRequestsService } from '../../../../core/services/budget-requests.service';
import { ClientsService } from '../../../../core/services/clients.service';
import { formatDateTime, getBudgetRequestStatusClass, translateBudgetRequestStatus } from '../../../../shared/utils/formatters';

interface ClientWithRequests extends Client {
  requestCount: number;
  requests: BudgetRequest[];
  latestRequest: BudgetRequest | null;
  dominantStatus: string;
}

@Component({
  selector: 'uatz-clients-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './clients-page.component.html',
  styleUrl: './clients-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClientsPageComponent {
  private readonly clientsService = inject(ClientsService);
  private readonly budgetRequestsService = inject(BudgetRequestsService);

  readonly isLoading = signal(true);
  readonly hasError = signal(false);
  readonly clients = signal<ClientWithRequests[]>([]);
  readonly selectedClientId = signal<number | null>(null);

  readonly selectedClient = computed(
    () => this.clients().find((client) => client.id === this.selectedClientId()) ?? null
  );

  constructor() {
    this.loadClients();
  }

  formatDateTime = formatDateTime;
  translateBudgetRequestStatus = translateBudgetRequestStatus;
  getBudgetRequestStatusClass = getBudgetRequestStatusClass;

  selectClient(clientId: number) {
    this.selectedClientId.set(clientId);
  }

  private loadClients() {
    forkJoin({
      clients: this.clientsService.findAllForAdmin(),
      requests: this.budgetRequestsService.findAll()
    })
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: ({ clients, requests }) => {
          const clientsWithRequests = clients
            .map((client) => {
              const clientRequests = requests.filter((request) => request.clientId === client.id);

              return {
                ...client,
                requestCount: clientRequests.length,
                requests: clientRequests.sort((left, right) => right.createdAt.localeCompare(left.createdAt)),
                latestRequest: clientRequests[0] ?? null,
                dominantStatus: this.resolveDominantStatus(clientRequests)
              } satisfies ClientWithRequests;
            })
            .sort((left, right) => right.requestCount - left.requestCount || left.phone.localeCompare(right.phone));

          this.clients.set(clientsWithRequests);
          this.selectedClientId.set(clientsWithRequests[0]?.id ?? null);
        },
        error: () => this.hasError.set(true)
      });
  }

  private resolveDominantStatus(requests: BudgetRequest[]): string {
    if (requests.length === 0) {
      return 'NO_REQUESTS';
    }

    const counts = requests.reduce<Record<string, number>>((accumulator, request) => {
      accumulator[request.status] = (accumulator[request.status] ?? 0) + 1;
      return accumulator;
    }, {});

    return Object.entries(counts).sort((left, right) => right[1] - left[1])[0][0];
  }
}
