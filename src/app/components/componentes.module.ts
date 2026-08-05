import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { PaginaCabecalhoComponent } from './pagina-cabecalho/pagina-cabecalho.component';
import { SituacaoFornecedorTagComponent } from './situacao-fornecedor-tag/situacao-fornecedor-tag.component';
import { SituacaoOrcamentoTagComponent } from './situacao-orcamento-tag/situacao-orcamento-tag.component';

const COMPONENTES = [
  PaginaCabecalhoComponent,
  SituacaoOrcamentoTagComponent,
  SituacaoFornecedorTagComponent
];

/**
 * Barrel dos componentes compartilhados. Importe este modulo nos modulos de
 * pagina para usar qualquer componente da pasta `components/`.
 */
@NgModule({
  declarations: [
    ...COMPONENTES
  ],
  imports: [
    CommonModule,
    NzTagModule
  ],
  exports: [
    ...COMPONENTES
  ]
})
export class ComponentesModule { }
