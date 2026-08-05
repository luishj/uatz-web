import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import {
  SITUACAO_ORCAMENTO_COR,
  SITUACAO_ORCAMENTO_DESCRICAO,
  SituacaoOrcamentoEnum
} from 'src/app/static/enum/situacao-orcamento.enum';
import { idioma } from 'src/environments/language/idioma';

/**
 * Tag com a situacao do pedido de orcamento.
 */
@Component({
  standalone: false,
  selector: 'uatz-situacao-orcamento-tag',
  templateUrl: './situacao-orcamento-tag.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SituacaoOrcamentoTagComponent {

  @Input() situacao: SituacaoOrcamentoEnum | string | null = null;

  get descricao(): string {
    const situacao = this.situacao as SituacaoOrcamentoEnum;
    return SITUACAO_ORCAMENTO_DESCRICAO[situacao] ?? idioma.APP.VAZIO;
  }

  get cor(): string {
    const situacao = this.situacao as SituacaoOrcamentoEnum;
    return SITUACAO_ORCAMENTO_COR[situacao] ?? 'default';
  }
}
