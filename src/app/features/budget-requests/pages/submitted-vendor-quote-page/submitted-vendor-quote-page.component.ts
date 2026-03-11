import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError, finalize, switchMap } from 'rxjs/operators';
import { AuthService } from '../../../../core/auth/auth.service';
import { BudgetRequestsService } from '../../../../core/services/budget-requests.service';
import { VendorQuotesService } from '../../../../core/services/vendor-quotes.service';
import { BudgetRequestVendor } from '../../../../core/models/budget-request.models';
import { VendorQuoteDetails } from '../../../../core/models/vendor-quote.models';
import { formatCurrency, formatDateTime } from '../../../../shared/utils/formatters';

@Component({
  selector: 'uatz-submitted-vendor-quote-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './submitted-vendor-quote-page.component.html',
  styleUrl: './submitted-vendor-quote-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SubmittedVendorQuotePageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  private readonly budgetRequestsService = inject(BudgetRequestsService);
  private readonly vendorQuotesService = inject(VendorQuotesService);
  private readonly requestId = Number(this.route.snapshot.paramMap.get('id'));

  readonly isLoading = signal(true);
  readonly errorMessage = signal('');
  readonly quote = signal<VendorQuoteDetails | null>(null);
  readonly assignment = signal<BudgetRequestVendor | null>(null);

  constructor() {
    this.loadPage();
  }

  formatCurrency = formatCurrency;
  formatDateTime = formatDateTime;

  private loadPage() {
    this.route.paramMap
      .pipe(
        switchMap((params) => {
          const requestId = Number(params.get('id'));

          if (!this.authService.isVendor()) {
            this.router.navigate(requestId ? ['/requests', requestId] : ['/requests']);
            return of(null);
          }

          if (!requestId) {
            this.errorMessage.set('Pedido invalido.');
            return of(null);
          }

          return forkJoin({
            assignment: this.budgetRequestsService.findMyAssignment(requestId).pipe(catchError(() => of(null))),
            quote: this.vendorQuotesService.findMineByRequestId(requestId).pipe(catchError(() => of(null)))
          });
        }),
        finalize(() => this.isLoading.set(false))
      )
      .subscribe({
        next: (result) => {
          if (!result) {
            return;
          }

          if (!result.assignment || result.assignment.status !== 'RESPONDED' || !result.quote) {
            this.router.navigate(this.requestId ? ['/requests', this.requestId] : ['/requests']);
            return;
          }

          this.assignment.set(result.assignment);
          this.quote.set(result.quote);
        },
        error: () => {
          this.errorMessage.set('Nao foi possivel carregar o orcamento enviado.');
        }
      });
  }
}
