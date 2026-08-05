import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

/**
 * Cabecalho padrao das paginas: eyebrow, titulo, subtitulo e um slot de acoes.
 *
 * ```html
 * <uatz-pagina-cabecalho [eyebrow]="idioma.ORCAMENTO.EYEBROW" [titulo]="idioma.ORCAMENTO.TITULO">
 *   <button nz-button nzType="primary">Acao</button>
 * </uatz-pagina-cabecalho>
 * ```
 */
@Component({
  standalone: false,
  selector: 'uatz-pagina-cabecalho',
  templateUrl: './pagina-cabecalho.component.html',
  styleUrls: ['./pagina-cabecalho.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaginaCabecalhoComponent {

  @Input() eyebrow: string | null = null;

  @Input() titulo: string | null = null;

  @Input() subtitulo: string | null = null;
}
