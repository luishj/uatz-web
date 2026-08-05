import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import {
  SITUACAO_ORCAMENTO_FORNECEDOR_COR,
  SITUACAO_ORCAMENTO_FORNECEDOR_DESCRICAO,
  SituacaoOrcamentoFornecedorEnum
} from 'src/app/static/enum/situacao-orcamento-fornecedor.enum';
import { idioma } from 'src/environments/language/idioma';

/**
 * Tag com a situacao do fornecedor dentro do pedido.
 */
@Component({
  standalone: false,
  selector: 'uatz-situacao-fornecedor-tag',
  templateUrl: './situacao-fornecedor-tag.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SituacaoFornecedorTagComponent {

  @Input() situacao: SituacaoOrcamentoFornecedorEnum | string | null = null;

  get descricao(): string {
    const situacao = this.situacao as SituacaoOrcamentoFornecedorEnum;
    return SITUACAO_ORCAMENTO_FORNECEDOR_DESCRICAO[situacao] ?? idioma.APP.VAZIO;
  }

  get cor(): string {
    const situacao = this.situacao as SituacaoOrcamentoFornecedorEnum;
    return SITUACAO_ORCAMENTO_FORNECEDOR_COR[situacao] ?? 'default';
  }
}
