import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormArray, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { forkJoin, of } from 'rxjs';
import { catchError, finalize, switchMap } from 'rxjs/operators';
import { AuthService } from '../../../../core/auth/auth.service';
import { BudgetRequestsService } from '../../../../core/services/budget-requests.service';
import { VendorQuotesService } from '../../../../core/services/vendor-quotes.service';
import { VendorsService } from '../../../../core/services/vendors.service';
import { BudgetRequest, BudgetRequestVendor } from '../../../../core/models/budget-request.models';
import { CurrentVendorQuoteContext } from '../../../../core/models/vendor.models';
import { VendorQuoteSummary } from '../../../../core/models/vendor-quote.models';
import {
  formatCurrency,
  formatDateTime,
  getBudgetRequestStatusClass,
  getBudgetRequestVendorStatusClass,
  translateBudgetRequestStatus
  ,
  translateBudgetRequestVendorStatus
} from '../../../../shared/utils/formatters';

@Component({
  selector: 'uatz-budget-request-detail-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './budget-request-detail-page.component.html',
  styleUrl: './budget-request-detail-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BudgetRequestDetailPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly budgetRequestsService = inject(BudgetRequestsService);
  private readonly vendorQuotesService = inject(VendorQuotesService);
  private readonly vendorsService = inject(VendorsService);

  readonly isLoading = signal(true);
  readonly isSubmitting = signal(false);
  readonly isReviewing = signal(false);
  readonly isDispatching = signal(false);
  readonly isDeclining = signal(false);
  readonly errorMessage = signal('');
  readonly successMessage = signal('');
  readonly request = signal<BudgetRequest | null>(null);
  readonly summary = signal<VendorQuoteSummary | null>(null);
  readonly currentVendor = signal<CurrentVendorQuoteContext | null>(null);
  readonly assignedVendors = signal<BudgetRequestVendor[]>([]);
  readonly myAssignment = signal<BudgetRequestVendor | null>(null);
  readonly isVendorUser = this.authService.isVendor;
  readonly isAdminOrOperator = computed(() => !this.isVendorUser());
  readonly vendorHasResponded = computed(() => this.myAssignment()?.status === 'RESPONDED');
  readonly vendorHasDeclined = computed(() => this.myAssignment()?.status === 'DECLINED');
  readonly vendorCanQuote = computed(() => {
    const assignment = this.myAssignment();
    return !assignment || (assignment.status !== 'RESPONDED' && assignment.status !== 'DECLINED');
  });
  readonly totalQuoteAmount = signal(0);

  readonly quoteForm = this.formBuilder.nonNullable.group({
    items: this.formBuilder.array([] as Array<ReturnType<BudgetRequestDetailPageComponent['createQuoteItemGroup']>>),
    message: ['']
  });

  readonly reviewForm = this.formBuilder.nonNullable.group({
    city: [''],
    items: this.formBuilder.array([] as Array<ReturnType<BudgetRequestDetailPageComponent['createReviewItemGroup']>>)
  });

  constructor() {
    this.quoteForm.controls.items.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateTotalQuoteAmount());

    this.loadPage();
  }

  formatCurrency = formatCurrency;
  formatDateTime = formatDateTime;
  translateBudgetRequestStatus = translateBudgetRequestStatus;
  getBudgetRequestStatusClass = getBudgetRequestStatusClass;
  translateBudgetRequestVendorStatus = translateBudgetRequestVendorStatus;
  getBudgetRequestVendorStatusClass = getBudgetRequestVendorStatusClass;

  get quoteItems(): FormArray<ReturnType<BudgetRequestDetailPageComponent['createQuoteItemGroup']>> {
    return this.quoteForm.controls.items;
  }

  get reviewItems(): FormArray<ReturnType<BudgetRequestDetailPageComponent['createReviewItemGroup']>> {
    return this.reviewForm.controls.items;
  }

  viewSubmittedQuote() {
    const currentRequest = this.request();
    if (!currentRequest) {
      return;
    }

    this.router.navigate(['/requests', currentRequest.id, 'submitted-quote']);
  }

  addReviewItem() {
    this.reviewItems.push(this.createReviewItemGroup('', 1, 'un'));
  }

  removeReviewItem(index: number) {
    if (this.reviewItems.length <= 1) {
      return;
    }

    this.reviewItems.removeAt(index);
  }

  saveReview() {
    const currentRequest = this.request();
    if (!currentRequest || this.reviewForm.invalid || this.isReviewing()) {
      this.reviewForm.markAllAsTouched();
      return;
    }

    this.errorMessage.set('');
    this.successMessage.set('');
    this.isReviewing.set(true);

    this.budgetRequestsService
      .review(currentRequest.id, {
        city: this.reviewForm.controls.city.getRawValue(),
        items: this.reviewItems.controls.map((control) => ({
          productId: null,
          productName: control.controls.productName.getRawValue(),
          quantity: Number(control.controls.quantity.getRawValue() || 0),
          unit: control.controls.unit.getRawValue()
        }))
      })
      .pipe(finalize(() => this.isReviewing.set(false)))
      .subscribe({
        next: (request) => {
          this.request.set(request);
          this.reviewForm.patchValue({ city: request.city ?? '' });
          this.rebuildReviewItems(request);
          this.rebuildQuoteItems(request);
          this.successMessage.set('Pedido revisado com sucesso.');
        },
        error: () => this.errorMessage.set('Nao foi possivel salvar a revisao do pedido.')
      });
  }

  dispatchRequest() {
    const currentRequest = this.request();
    if (!currentRequest || this.isDispatching()) {
      return;
    }

    this.errorMessage.set('');
    this.successMessage.set('');
    this.isDispatching.set(true);

    this.budgetRequestsService
      .dispatch(currentRequest.id)
      .pipe(finalize(() => this.isDispatching.set(false)))
      .subscribe({
        next: (assignedVendors) => {
          this.assignedVendors.set(assignedVendors);
          this.request.update((request) => (request ? { ...request, status: 'SENT_TO_VENDORS' } : request));
          this.successMessage.set('Pedido distribuido para os fornecedores elegiveis.');
        },
        error: () => this.errorMessage.set('Nao foi possivel distribuir o pedido.')
      });
  }

  declineRequest() {
    const currentRequest = this.request();
    if (!currentRequest || this.isDeclining()) {
      return;
    }

    this.errorMessage.set('');
    this.successMessage.set('');
    this.isDeclining.set(true);

    this.budgetRequestsService
      .decline(currentRequest.id)
      .pipe(finalize(() => this.isDeclining.set(false)))
      .subscribe({
        next: () => {
          this.successMessage.set('Pedido recusado para este fornecedor.');
          this.request.update((request) => (request ? { ...request, status: 'WAITING_QUOTES' } : request));
          this.myAssignment.update((assignment) =>
            assignment ? { ...assignment, status: 'DECLINED', declinedAt: new Date().toISOString() } : assignment
          );
        },
        error: () => this.errorMessage.set('Nao foi possivel recusar este pedido.')
      });
  }

  submitQuote() {
    const currentRequest = this.request();
    const currentVendor = this.currentVendor();

    if (!currentRequest || !currentVendor || this.quoteForm.invalid || this.isSubmitting()) {
      this.quoteForm.markAllAsTouched();
      return;
    }

    this.errorMessage.set('');
    this.successMessage.set('');
    this.isSubmitting.set(true);

    this.vendorQuotesService
      .create({
        requestId: currentRequest.id,
        vendorId: currentVendor.id,
        message: this.quoteForm.controls.message.getRawValue(),
        items: this.quoteItems.controls.map((control) => ({
          budgetItemId: Number(control.controls.budgetItemId.getRawValue()),
          unitPrice: Number(control.controls.unitPrice.getRawValue() || 0)
        }))
      })
      .pipe(finalize(() => this.isSubmitting.set(false)))
      .subscribe({
        next: () => {
          this.myAssignment.update((assignment) =>
            assignment ? { ...assignment, status: 'RESPONDED', respondedAt: new Date().toISOString() } : assignment
          );
          this.refreshSummary(currentRequest.id);
          this.router.navigate(['/requests', currentRequest.id, 'submitted-quote']);
        },
        error: () => this.errorMessage.set('Nao foi possivel registrar a cotacao.')
      });
  }

  private loadPage() {
    this.route.paramMap
      .pipe(
        switchMap((params) => {
          const requestId = Number(params.get('id'));

          if (!requestId) {
            this.errorMessage.set('Pedido invalido.');
            this.isLoading.set(false);
            return of(null);
          }

          return forkJoin({
            request: this.budgetRequestsService.findById(requestId),
            summary: this.vendorQuotesService
              .summarizeByRequestId(requestId)
              .pipe(catchError(() => of(this.emptySummary(requestId)))),
            assignedVendors: this.authService.isVendor()
              ? of([] as BudgetRequestVendor[])
              : this.budgetRequestsService.findAssignedVendors(requestId).pipe(catchError(() => of([] as BudgetRequestVendor[]))),
            myAssignment: this.authService.isVendor()
              ? this.budgetRequestsService.findMyAssignment(requestId).pipe(catchError(() => of(null)))
              : of(null),
            currentVendor: this.authService.isVendor()
              ? this.vendorsService.findCurrentVendor().pipe(catchError(() => of(null)))
              : of(null)
          });
        }),
        finalize(() => this.isLoading.set(false))
      )
      .subscribe({
        next: (result) => {
          if (!result) {
            return;
          }

          this.request.set(result.request);
          this.summary.set(result.summary);
          this.assignedVendors.set(result.assignedVendors);
          this.myAssignment.set(result.myAssignment);
          this.currentVendor.set(result.currentVendor);
          this.reviewForm.patchValue({ city: result.request.city ?? '' });
          this.rebuildReviewItems(result.request);
          this.rebuildQuoteItems(result.request);

          if (this.authService.isVendor() && !result.currentVendor) {
            this.errorMessage.set('Nao foi encontrado um perfil de fornecedor vinculado ao usuario logado.');
          }
        },
        error: () => {
          this.errorMessage.set('Nao foi possivel carregar os detalhes do pedido.');
        }
      });
  }

  private refreshSummary(requestId: number) {
    this.vendorQuotesService
      .summarizeByRequestId(requestId)
      .pipe(catchError(() => of(this.emptySummary(requestId))))
      .subscribe((summary) => this.summary.set(summary));
  }

  private emptySummary(requestId: number): VendorQuoteSummary {
    return {
      requestId,
      totalQuotes: 0,
      lowestPrice: null,
      highestPrice: null,
      averagePrice: null,
      bestQuote: null,
      quotes: []
    };
  }

  private rebuildQuoteItems(request: BudgetRequest) {
    this.quoteItems.clear();

    request.items.forEach((item) => {
      this.quoteItems.push(this.createQuoteItemGroup(item.id, item.productName, item.quantity, item.unit ?? '', 0));
    });

    this.updateTotalQuoteAmount();
  }

  private rebuildReviewItems(request: BudgetRequest) {
    this.reviewItems.clear();

    request.items.forEach((item) => {
      this.reviewItems.push(this.createReviewItemGroup(item.productName, item.quantity, item.unit ?? 'un'));
    });
  }

  private createQuoteItemGroup(budgetItemId: number, productName: string, quantity: number, unit: string, unitPrice: number) {
    return this.formBuilder.nonNullable.group({
      budgetItemId: [budgetItemId],
      productName: [productName],
      quantity: [quantity],
      unit: [unit],
      unitPrice: [unitPrice, [Validators.required, Validators.min(0)]]
    });
  }

  private createReviewItemGroup(productName: string, quantity: number, unit: string) {
    return this.formBuilder.nonNullable.group({
      productName: [productName, [Validators.required, Validators.maxLength(150)]],
      quantity: [quantity, [Validators.required, Validators.min(0.01)]],
      unit: [unit, [Validators.maxLength(30)]]
    });
  }

  private updateTotalQuoteAmount() {
    const total = this.quoteItems.controls.reduce(
      (sum, control) =>
        sum + Number(control.controls.quantity.getRawValue() || 0) * Number(control.controls.unitPrice.getRawValue() || 0),
      0
    );

    this.totalQuoteAmount.set(total);
  }
}
