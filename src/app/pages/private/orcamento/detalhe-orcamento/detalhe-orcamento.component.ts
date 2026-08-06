import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, of, Subscription } from 'rxjs';
import { catchError, finalize, switchMap } from 'rxjs/operators';
import { AutenticacaoService } from 'src/app/services/base/autenticacao.service';
import { CotacaoService } from 'src/app/services/cotacao/cotacao.service';
import { OrcamentoService } from 'src/app/services/orcamento/orcamento.service';
import { ToastService } from 'src/app/services/toast.service';
import { SituacaoOrcamentoEnum } from 'src/app/static/enum/situacao-orcamento.enum';
import { SituacaoOrcamentoFornecedorEnum } from 'src/app/static/enum/situacao-orcamento-fornecedor.enum';
import { FormHelper } from 'src/app/static/helpers/form.helper';
import { NumberHelper } from 'src/app/static/helpers/number.helper';
import { StringHelper } from 'src/app/static/helpers/string.helper';
import { CotacaoResumoDTO } from 'src/app/static/model/cotacao/cotacao.dto';
import { FornecedorDTO } from 'src/app/static/model/fornecedor/fornecedor.dto';
import {
  OrcamentoDTO,
  OrcamentoFornecedorDTO,
  OrcamentoItemDTO
} from 'src/app/static/model/orcamento/orcamento.dto';
import { FornecedorService } from 'src/app/services/fornecedor/fornecedor.service';
import { Utils } from 'src/app/static/utils/utils';
import { idioma } from 'src/environments/language/idioma';

@Component({
  standalone: false,
  selector: 'uatz-detalhe-orcamento',
  templateUrl: './detalhe-orcamento.component.html',
  styleUrls: ['./detalhe-orcamento.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DetalheOrcamentoComponent implements OnInit, OnDestroy {

  idioma = idioma;

  flagCarregando = true;
  flagSalvandoCotacao = false;
  flagSalvandoRevisao = false;
  flagDistribuindo = false;
  flagRecusando = false;

  mensagemErro = StringHelper.STRING_VAZIA;

  orcamento: OrcamentoDTO | null = null;
  resumo: CotacaoResumoDTO | null = null;
  fornecedorAtual: FornecedorDTO | null = null;
  fornecedoresVinculados: OrcamentoFornecedorDTO[] = [];
  minhaAtribuicao: OrcamentoFornecedorDTO | null = null;

  totalCotacao = 0;

  formCotacao = this._formBuilder.group({
    items: this._formBuilder.array<FormGroup>([]),
    message: this._formBuilder.nonNullable.control('')
  });

  formRevisao = this._formBuilder.group({
    city: this._formBuilder.nonNullable.control(''),
    items: this._formBuilder.array<FormGroup>([])
  });

  private _subscriptions = new Subscription();

  constructor(
    private _formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private autenticacaoService: AutenticacaoService,
    private orcamentoService: OrcamentoService,
    private cotacaoService: CotacaoService,
    private fornecedorService: FornecedorService,
    private toastService: ToastService,
    private utils: Utils,
    private changeDetector: ChangeDetectorRef
  ) { }

  ngOnInit(): void {

    this._subscriptions.add(
      this.itensCotacao.valueChanges.subscribe(() => {
        this.calcularTotalCotacao();
        this.changeDetector.markForCheck();
      })
    );

    this.carregarPagina();
  }

  ngOnDestroy(): void {
    this._subscriptions.unsubscribe();
  }

  get itensCotacao(): FormArray<FormGroup> {
    return this.formCotacao.controls.items;
  }

  get itensRevisao(): FormArray<FormGroup> {
    return this.formRevisao.controls.items;
  }

  get flagFornecedor(): boolean {
    return this.autenticacaoService.isFornecedor();
  }

  get flagAdminOuOperador(): boolean {
    return !this.flagFornecedor;
  }

  get flagFornecedorRespondeu(): boolean {
    return this.minhaAtribuicao?.status === SituacaoOrcamentoFornecedorEnum.RESPONDED;
  }

  get flagFornecedorRecusou(): boolean {
    return this.minhaAtribuicao?.status === SituacaoOrcamentoFornecedorEnum.DECLINED;
  }

  get flagFornecedorPodeCotar(): boolean {
    return !this.flagFornecedorRespondeu && !this.flagFornecedorRecusou;
  }

  get titulo(): string {
    return StringHelper.formatString(idioma.DETALHE_ORCAMENTO.TITULO, [this.orcamento?.id ?? '']);
  }

  get subtitulo(): string {
    return StringHelper.formatString(idioma.DETALHE_ORCAMENTO.SUBTITULO, [
      this.orcamento?.clientPhone ?? '',
      this.utils.ouEntao(this.orcamento?.city, idioma.APP.CIDADE_NAO_INFORMADA)
    ]);
  }

  formatarValor(valor: number | null): string {
    return this.utils.formatarValor(valor);
  }

  formatarDataHora(valor: string | null): string {
    return this.utils.formatarDataHora(valor);
  }

  descricaoUnidade(item: OrcamentoItemDTO): string {
    return this.utils.ouEntao(item.unit, idioma.DETALHE_ORCAMENTO.UNIDADE_NAO_INFORMADA);
  }

  descricaoRespostaFinalizada(): string {
    return StringHelper.formatString(idioma.DETALHE_ORCAMENTO.RESPOSTA_FINALIZADA, [
      this.formatarDataHora(this.minhaAtribuicao?.respondedAt ?? null)
    ]);
  }

  descricaoDataAtribuicao(chave: string, valor: string | null): string {
    return StringHelper.formatString(chave, [this.formatarDataHora(valor)]);
  }

  adicionarItemRevisao(): void {
    this.itensRevisao.push(this.criarItemRevisao('', 1, 'un'));
  }

  removerItemRevisao(indice: number): void {

    if (this.itensRevisao.length <= 1) {
      return;
    }

    this.itensRevisao.removeAt(indice);
  }

  salvarRevisao(): void {

    if (!this.orcamento || this.formRevisao.invalid || this.flagSalvandoRevisao) {
      FormHelper.markFieldsInvalid(this.formRevisao.controls);
      return;
    }

    this.flagSalvandoRevisao = true;

    this.orcamentoService.revisar(this.orcamento.id, {
      city: this.formRevisao.controls.city.value,
      items: this.itensRevisao.controls.map(control => ({
        productId: null,
        productName: control.get('productName')?.value,
        quantity: NumberHelper.paraNumero(control.get('quantity')?.value),
        unit: control.get('unit')?.value
      }))
    })
      .pipe(finalize(() => {
        this.flagSalvandoRevisao = false;
        this.changeDetector.markForCheck();
      }))
      .subscribe({
        next: orcamento => {
          this.orcamento = orcamento;
          this.formRevisao.controls.city.setValue(orcamento.city ?? '');
          this.montarItensRevisao(orcamento);
          this.montarItensCotacao(orcamento);
          this.toastService.success(idioma.DETALHE_ORCAMENTO.REVISAO_SUCESSO);
        },
        error: () => { }
      });
  }

  distribuir(): void {

    if (!this.orcamento || this.flagDistribuindo) {
      return;
    }

    this.flagDistribuindo = true;

    this.orcamentoService.distribuir(this.orcamento.id)
      .pipe(finalize(() => {
        this.flagDistribuindo = false;
        this.changeDetector.markForCheck();
      }))
      .subscribe({
        next: fornecedores => {
          this.fornecedoresVinculados = fornecedores;

          if (this.orcamento) {
            this.orcamento = { ...this.orcamento, status: SituacaoOrcamentoEnum.SENT_TO_VENDORS };
          }

          this.toastService.success(idioma.DETALHE_ORCAMENTO.DISTRIBUICAO_SUCESSO);
        },
        error: () => { }
      });
  }

  recusar(): void {

    if (!this.orcamento || this.flagRecusando) {
      return;
    }

    this.flagRecusando = true;

    this.orcamentoService.recusar(this.orcamento.id)
      .pipe(finalize(() => {
        this.flagRecusando = false;
        this.changeDetector.markForCheck();
      }))
      .subscribe({
        next: () => {
          this.toastService.success(idioma.DETALHE_ORCAMENTO.RECUSA_SUCESSO);

          if (this.minhaAtribuicao) {
            this.minhaAtribuicao = {
              ...this.minhaAtribuicao,
              status: SituacaoOrcamentoFornecedorEnum.DECLINED,
              declinedAt: new Date().toISOString()
            };
          }
        },
        error: () => { }
      });
  }

  salvarCotacao(): void {

    if (!this.orcamento || !this.fornecedorAtual || this.formCotacao.invalid || this.flagSalvandoCotacao) {
      FormHelper.markFieldsInvalid(this.formCotacao.controls);
      return;
    }

    this.flagSalvandoCotacao = true;

    const codigoOrcamento = this.orcamento.id;

    this.cotacaoService.salvar({
      requestId: codigoOrcamento,
      vendorId: this.fornecedorAtual.id,
      message: this.formCotacao.controls.message.value ?? '',
      items: this.itensCotacao.controls.map(control => ({
        budgetItemId: NumberHelper.paraNumero(control.get('budgetItemId')?.value),
        unitPrice: NumberHelper.paraNumero(control.get('unitPrice')?.value)
      }))
    })
      .pipe(finalize(() => {
        this.flagSalvandoCotacao = false;
        this.changeDetector.markForCheck();
      }))
      .subscribe({
        next: () => void this.router.navigate(['/orcamentos', codigoOrcamento, 'cotacao-enviada']),
        error: () => { }
      });
  }

  verCotacaoEnviada(): void {

    if (!this.orcamento) {
      return;
    }

    void this.router.navigate(['/orcamentos', this.orcamento.id, 'cotacao-enviada']);
  }

  private carregarPagina(): void {

    this._subscriptions.add(
      this.route.paramMap
        .pipe(
          switchMap(params => {

            const codigo = Number(params.get('id'));

            if (!codigo) {
              this.mensagemErro = idioma.DETALHE_ORCAMENTO.ORCAMENTO_INVALIDO;
              this.flagCarregando = false;
              return of(null);
            }

            const flagFornecedor = this.autenticacaoService.isFornecedor();

            return forkJoin({
              orcamento: this.orcamentoService.obter(codigo),
              // O resumo compara as cotacoes de todos os fornecedores do pedido, entao
              // o servidor so o entrega a ADMIN/OPERATOR. Nem pedimos para o fornecedor:
              // evita um 403 no console a cada abertura da tela.
              resumo: flagFornecedor
                ? of(this.resumoVazio(codigo))
                : this.cotacaoService.adquirirResumoPorOrcamento(codigo)
                  .pipe(catchError(() => of(this.resumoVazio(codigo)))),
              fornecedoresVinculados: flagFornecedor
                ? of([] as OrcamentoFornecedorDTO[])
                : this.orcamentoService.listarFornecedores(codigo).pipe(catchError(() => of([] as OrcamentoFornecedorDTO[]))),
              minhaAtribuicao: flagFornecedor
                ? this.orcamentoService.adquirirMinhaAtribuicao(codigo).pipe(catchError(() => of(null)))
                : of(null),
              fornecedorAtual: flagFornecedor
                ? this.fornecedorService.adquirirFornecedorAtual().pipe(catchError(() => of(null)))
                : of(null)
            });
          }),
          finalize(() => {
            this.flagCarregando = false;
            this.changeDetector.markForCheck();
          })
        )
        .subscribe({
          next: retorno => {

            if (!retorno) {
              return;
            }

            this.orcamento = retorno.orcamento;
            this.resumo = retorno.resumo;
            this.fornecedoresVinculados = retorno.fornecedoresVinculados;
            this.minhaAtribuicao = retorno.minhaAtribuicao;
            this.fornecedorAtual = retorno.fornecedorAtual;

            this.formRevisao.controls.city.setValue(retorno.orcamento.city ?? '');
            this.montarItensRevisao(retorno.orcamento);
            this.montarItensCotacao(retorno.orcamento);

            if (this.flagFornecedor && !retorno.fornecedorAtual) {
              this.mensagemErro = idioma.DETALHE_ORCAMENTO.FORNECEDOR_NAO_VINCULADO;
            }
          },
          error: () => this.mensagemErro = idioma.DETALHE_ORCAMENTO.FALHA_CARREGAR
        })
    );
  }

  private montarItensCotacao(orcamento: OrcamentoDTO): void {

    this.itensCotacao.clear();

    orcamento.items.forEach(item => {
      this.itensCotacao.push(this.criarItemCotacao(item));
    });

    this.calcularTotalCotacao();
  }

  private montarItensRevisao(orcamento: OrcamentoDTO): void {

    this.itensRevisao.clear();

    orcamento.items.forEach(item => {
      this.itensRevisao.push(this.criarItemRevisao(item.productName, item.quantity, item.unit ?? 'un'));
    });
  }

  private criarItemCotacao(item: OrcamentoItemDTO): FormGroup {
    return this._formBuilder.group({
      budgetItemId: [item.id],
      productName: [item.productName],
      quantity: [item.quantity],
      unit: [item.unit ?? ''],
      unitPrice: [0, [Validators.required, Validators.min(0)]]
    });
  }

  private criarItemRevisao(productName: string, quantity: number, unit: string): FormGroup {
    return this._formBuilder.group({
      productName: [productName, [Validators.required, Validators.maxLength(150)]],
      quantity: [quantity, [Validators.required, Validators.min(0.01)]],
      unit: [unit, [Validators.maxLength(30)]]
    });
  }

  private calcularTotalCotacao(): void {
    this.totalCotacao = this.itensCotacao.controls.reduce((total, control) =>
      total + NumberHelper.paraNumero(control.get('quantity')?.value) * NumberHelper.paraNumero(control.get('unitPrice')?.value)
      , 0);
  }

  private resumoVazio(codigoOrcamento: number): CotacaoResumoDTO {
    return {
      requestId: codigoOrcamento,
      totalQuotes: 0,
      lowestPrice: null,
      highestPrice: null,
      averagePrice: null,
      bestQuote: null,
      quotes: []
    };
  }
}
