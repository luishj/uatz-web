import { Routes } from '@angular/router';
import { adminGuard } from './core/auth/admin.guard';
import { authGuard } from './core/auth/auth.guard';
import { guestGuard } from './core/auth/guest.guard';
import { AppShellComponent } from './layout/app-shell/app-shell.component';
import { LoginPageComponent } from './features/auth/pages/login-page/login-page.component';
import { DashboardHomePageComponent } from './features/dashboard/pages/dashboard-home-page/dashboard-home-page.component';
import { BudgetRequestsPageComponent } from './features/budget-requests/pages/budget-requests-page/budget-requests-page.component';
import { BudgetRequestDetailPageComponent } from './features/budget-requests/pages/budget-request-detail-page/budget-request-detail-page.component';
import { SubmittedVendorQuotePageComponent } from './features/budget-requests/pages/submitted-vendor-quote-page/submitted-vendor-quote-page.component';
import { WhatsAppSimulationPageComponent } from './features/budget-requests/pages/whatsapp-simulation-page/whatsapp-simulation-page.component';
import { ClientsPageComponent } from './features/clients/pages/clients-page/clients-page.component';
import { VendorsPageComponent } from './features/vendors/pages/vendors-page/vendors-page.component';

export const appRoutes: Routes = [
  {
    path: 'login',
    canActivate: [guestGuard],
    component: LoginPageComponent
  },
  {
    path: '',
    canActivate: [authGuard],
    component: AppShellComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: DashboardHomePageComponent
      },
      {
        path: 'requests',
        component: BudgetRequestsPageComponent
      },
      {
        path: 'requests/simulate-whatsapp',
        component: WhatsAppSimulationPageComponent
      },
      {
        path: 'requests/:id',
        component: BudgetRequestDetailPageComponent
      },
      {
        path: 'requests/:id/submitted-quote',
        component: SubmittedVendorQuotePageComponent
      },
      {
        path: 'clients',
        canActivate: [adminGuard],
        component: ClientsPageComponent
      },
      {
        path: 'vendors',
        canActivate: [adminGuard],
        component: VendorsPageComponent
      }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];
