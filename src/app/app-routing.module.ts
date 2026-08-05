import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminGuard } from './guards/admin.guard';
import { AuthGuard } from './guards/auth.guard';
import { VisitanteGuard } from './guards/visitante.guard';

const routes: Routes = [
  {
    path: 'public',
    children: [
      {
        path: 'login',
        canActivate: [VisitanteGuard],
        loadChildren: () => import('./pages/public/login/login.module').then(m => m.LoginModule)
      }
    ]
  },
  {
    path: '',
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        loadChildren: () => import('./pages/private/dashboard/dashboard.module').then(m => m.DashboardModule)
      },
      {
        path: 'orcamentos',
        loadChildren: () => import('./pages/private/orcamento/lista-orcamento/lista-orcamento.module').then(m => m.ListaOrcamentoModule)
      },
      {
        path: 'simular-whatsapp',
        loadChildren: () => import('./pages/private/orcamento/simulacao-whatsapp/simulacao-whatsapp.module').then(m => m.SimulacaoWhatsAppModule)
      },
      {
        path: 'orcamentos/:id',
        loadChildren: () => import('./pages/private/orcamento/detalhe-orcamento/detalhe-orcamento.module').then(m => m.DetalheOrcamentoModule)
      },
      {
        path: 'orcamentos/:id/cotacao-enviada',
        loadChildren: () => import('./pages/private/orcamento/cotacao-enviada/cotacao-enviada.module').then(m => m.CotacaoEnviadaModule)
      },
      {
        path: 'clientes',
        canActivate: [AdminGuard],
        loadChildren: () => import('./pages/private/cliente/cliente.module').then(m => m.ClienteModule)
      },
      {
        path: 'fornecedores',
        canActivate: [AdminGuard],
        loadChildren: () => import('./pages/private/fornecedor/fornecedor.module').then(m => m.FornecedorModule)
      }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
