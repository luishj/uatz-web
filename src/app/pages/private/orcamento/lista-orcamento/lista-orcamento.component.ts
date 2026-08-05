import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs';
import { OrcamentoService } from 'src/app/services/orcamento/orcamento.service';
import { StringHelper } from 'src/app/static/helpers/string.helper';
import { OrcamentoDTO } from 'src/app/static/model/orcamento/orcamento.dto';
import { Utils } from 'src/app/static/utils/utils';
import { idioma } from 'src/environments/language/idioma';

@Component({
  standalone: false,
  selector: 'uatz-lista-orcamento',
  templateUrl: './lista-orcamento.component.html',
  styleUrls: ['./lista-orcamento.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListaOrcamentoComponent implements OnInit {

  idioma = idioma;

  flagCarregando = true;
  flagFalha = false;

  orcamentos: OrcamentoDTO[] = [];
  totalItens = 0;

  constructor(
    private orcamentoService: OrcamentoService,
    private utils: Utils,
    private changeDetector: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.listarOrcamentos();
  }

  formatarDataHora(valor: string | null): string {
    return this.utils.formatarDataHora(valor);
  }

  descricaoCidade(orcamento: OrcamentoDTO): string {
    return this.utils.ouEntao(orcamento.city);
  }

  get descricaoTotal(): string {
    return StringHelper.formatString(idioma.ORCAMENTO.TOTAL, [this.orcamentos.length]);
  }

  get descricaoTotalItens(): string {
    return StringHelper.formatString(idioma.ORCAMENTO.TOTAL_ITENS, [this.totalItens]);
  }

  private listarOrcamentos(): void {
    this.orcamentoService.listar()
      .pipe(finalize(() => {
        this.flagCarregando = false;
        this.changeDetector.markForCheck();
      }))
      .subscribe({
        next: orcamentos => {
          this.orcamentos = [...orcamentos].sort((esquerda, direita) =>
            direita.createdAt.localeCompare(esquerda.createdAt)
          );
          this.totalItens = this.orcamentos.reduce((total, orcamento) => total + orcamento.items.length, 0);
        },
        error: () => this.flagFalha = true
      });
  }
}
