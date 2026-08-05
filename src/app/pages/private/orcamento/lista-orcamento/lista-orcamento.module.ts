import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzTableModule } from 'ng-zorro-antd/table';
import { ComponentesModule } from 'src/app/components/componentes.module';
import { ListaOrcamentoComponent } from './lista-orcamento.component';

const routes: Routes = [
  {
    path: '',
    component: ListaOrcamentoComponent
  }
];

@NgModule({
  declarations: [
    ListaOrcamentoComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ComponentesModule,
    NzAlertModule,
    NzCardModule,
    NzEmptyModule,
    NzTableModule
  ]
})
export class ListaOrcamentoModule { }
