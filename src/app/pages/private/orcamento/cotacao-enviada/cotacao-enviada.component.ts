import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, of, Subscription } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AutenticacaoService } from 'src/app/services/base/autenticacao.service';
import { CotacaoService } from 'src/app/services/cotacao/cotacao.service';
import { OrcamentoService } from 'src/app/services/orcamento/orcamento.service';
import { SituacaoOrcamentoFornecedorEnum } from 'src/app/static/enum/situacao-orcamento-fornecedor.enum';
import { StringHelper } from 'src/app/static/helpers/string.helper';
import { CotacaoDetalheDTO, CotacaoItemDTO } from 'src/app/static/model/cotacao/cotacao.dto';
import { OrcamentoFornecedorDTO } from 'src/app/static/model/orcamento/orcamento.dto';
import { Utils } from 'src/app/static/utils/utils';
import { idioma } from 'src/environments/language/idioma';

@Component({
  standalone: false,
  selector: 'uatz-cotacao-enviada',
  templateUrl: './cotacao-enviada.component.html',
  styleUrls: ['./cotacao-enviada.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CotacaoEnviadaComponent implements OnInit, OnDestroy {

  idioma = idioma;

  flagCarregando = true;
  mensagemErro = StringHelper.STRING_VAZIA;

  cotacao: CotacaoDetalheDTO | null = null;
  atribuicao: OrcamentoFornecedorDTO | null = null;

  private _subscriptions = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private autenticacaoService: AutenticacaoService,
    private orcamentoService: OrcamentoService,
    private cotacaoService: CotacaoService,
    private utils: Utils,
    private changeDetector: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.carregarPagina();
  }

  ngOnDestroy(): void {
    this._subscriptions.unsubscribe();
  }

  formatarValor(valor: number | null): string {
    return this.utils.formatarValor(valor);
  }

  formatarDataHora(valor: string | null): string {
    return this.utils.formatarDataHora(valor);
  }

  descricaoUnidade(item: CotacaoItemDTO): string {
    return this.utils.ouEntao(item.unit, idioma.APP.UNIDADES);
  }

  get titulo(): string {
    return StringHelper.formatString(idioma.COTACAO_ENVIADA.TITULO, [this.cotacao?.requestId ?? '']);
  }

  get subtitulo(): string {
    return StringHelper.formatString(idioma.COTACAO_ENVIADA.SUBTITULO, [this.cotacao?.vendorName ?? '']);
  }

  descricaoTotalItem(item: CotacaoItemDTO): string {
    return StringHelper.formatString(idioma.COTACAO_ENVIADA.TOTAL_ITEM, [this.formatarValor(item.lineTotal)]);
  }

  private carregarPagina(): void {

    this._subscriptions.add(
      this.route.paramMap
        .pipe(
          switchMap(params => {

            const codigoOrcamento = Number(params.get('id'));

            if (!this.autenticacaoService.isFornecedor()) {
              void this.router.navigate(codigoOrcamento ? ['/orcamentos', codigoOrcamento] : ['/orcamentos']);
              return of(null);
            }

            if (!codigoOrcamento) {
              this.mensagemErro = idioma.DETALHE_ORCAMENTO.ORCAMENTO_INVALIDO;
              return of(null);
            }

            this.flagCarregando = true;

            return forkJoin({
              atribuicao: this.orcamentoService.adquirirMinhaAtribuicao(codigoOrcamento).pipe(catchError(() => of(null))),
              cotacao: this.cotacaoService.adquirirMinhaPorOrcamento(codigoOrcamento).pipe(catchError(() => of(null)))
            });
          })
        )
        .subscribe({
          next: retorno => {

            this.finalizarCarregamento();

            if (!retorno) {
              return;
            }

            const respondeu = retorno.atribuicao?.status === SituacaoOrcamentoFornecedorEnum.RESPONDED;

            if (!respondeu || !retorno.cotacao) {
              const codigoOrcamento = Number(this.route.snapshot.paramMap.get('id'));
              void this.router.navigate(codigoOrcamento ? ['/orcamentos', codigoOrcamento] : ['/orcamentos']);
              return;
            }

            this.atribuicao = retorno.atribuicao;
            this.cotacao = retorno.cotacao;
          },
          error: () => {
            this.mensagemErro = idioma.COTACAO_ENVIADA.FALHA_CARREGAR;
            this.finalizarCarregamento();
          }
        })
    );
  }

  /**
   * `route.paramMap` nao completa enquanto a rota esta ativa, entao o `finalize`
   * do pipe nunca rodaria: o `markForCheck` precisa acontecer em cada emissao,
   * senao a view OnPush fica sem renderizar o orcamento carregado.
   */
  private finalizarCarregamento(): void {
    this.flagCarregando = false;
    this.changeDetector.markForCheck();
  }
}
