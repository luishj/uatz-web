import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs';
import { OrcamentoService } from 'src/app/services/orcamento/orcamento.service';
import { StringHelper } from 'src/app/static/helpers/string.helper';
import { SituacaoOrcamentoEnum } from 'src/app/static/enum/situacao-orcamento.enum';
import { OrcamentoDTO } from 'src/app/static/model/orcamento/orcamento.dto';
import { Utils } from 'src/app/static/utils/utils';
import { idioma } from 'src/environments/language/idioma';

@Component({
  standalone: false,
  selector: 'uatz-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent implements OnInit {

  idioma = idioma;

  flagCarregando = true;

  orcamentos: OrcamentoDTO[] = [];
  ultimosOrcamentos: OrcamentoDTO[] = [];

  totalOrcamentos = 0;
  totalAbertos = 0;
  totalAguardandoCotacao = 0;

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

  descricaoClienteCidade(orcamento: OrcamentoDTO): string {
    return StringHelper.formatString(idioma.DASHBOARD.CLIENTE_CIDADE, [
      orcamento.clientId,
      this.utils.ouEntao(orcamento.city, idioma.APP.CIDADE_NAO_INFORMADA)
    ]);
  }

  descricaoOrcamento(orcamento: OrcamentoDTO): string {
    return StringHelper.formatString(idioma.DASHBOARD.ORCAMENTO, [orcamento.id]);
  }

  private listarOrcamentos(): void {
    this.orcamentoService.listar()
      .pipe(finalize(() => {
        this.flagCarregando = false;
        this.changeDetector.markForCheck();
      }))
      .subscribe({
        next: orcamentos => this.definirOrcamentos(orcamentos),
        error: () => this.definirOrcamentos([])
      });
  }

  private definirOrcamentos(orcamentos: OrcamentoDTO[]): void {

    this.orcamentos = [...orcamentos].sort((esquerda, direita) =>
      direita.createdAt.localeCompare(esquerda.createdAt)
    );

    this.ultimosOrcamentos = this.orcamentos.slice(0, 5);
    this.totalOrcamentos = this.orcamentos.length;
    this.totalAbertos = this.contarPorSituacao(SituacaoOrcamentoEnum.OPEN);
    this.totalAguardandoCotacao = this.contarPorSituacao(SituacaoOrcamentoEnum.WAITING_QUOTES);
  }

  private contarPorSituacao(situacao: SituacaoOrcamentoEnum): number {
    return this.orcamentos.filter(orcamento => orcamento.status === situacao).length;
  }
}
