import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { ComponentesModule } from 'src/app/components/componentes.module';
import { ClienteComponent } from './cliente.component';

const routes: Routes = [
  {
    path: '',
    component: ClienteComponent
  }
];

@NgModule({
  declarations: [
    ClienteComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ComponentesModule,
    NzAlertModule,
    NzCardModule,
    NzDescriptionsModule,
    NzEmptyModule,
    NzListModule,
    NzTagModule
  ]
})
export class ClienteModule { }
