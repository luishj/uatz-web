import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { NzStatisticModule } from 'ng-zorro-antd/statistic';
import { NzTableModule } from 'ng-zorro-antd/table';
import { ComponentesModule } from 'src/app/components/componentes.module';
import { CotacaoEnviadaComponent } from './cotacao-enviada.component';

const routes: Routes = [
  {
    path: '',
    component: CotacaoEnviadaComponent
  }
];

@NgModule({
  declarations: [
    CotacaoEnviadaComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ComponentesModule,
    NzAlertModule,
    NzButtonModule,
    NzCardModule,
    NzGridModule,
    NzIconModule,
    NzSkeletonModule,
    NzStatisticModule,
    NzTableModule
  ]
})
export class CotacaoEnviadaModule { }
