import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { ClienteService } from 'src/app/services/cliente/cliente.service';
import { OrcamentoService } from 'src/app/services/orcamento/orcamento.service';
import { StringHelper } from 'src/app/static/helpers/string.helper';
import { ClienteComOrcamentosDTO } from 'src/app/static/model/cliente/cliente.dto';
import { OrcamentoDTO } from 'src/app/static/model/orcamento/orcamento.dto';
import { Utils } from 'src/app/static/utils/utils';
import { idioma } from 'src/environments/language/idioma';

/** Situacao usada quando o cliente ainda nao gerou pedidos. */
const SEM_ORCAMENTOS = 'NO_REQUESTS';

@Component({
  standalone: false,
  selector: 'uatz-cliente',
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClienteComponent implements OnInit {

  idioma = idioma;

  flagCarregando = true;
  flagFalha = false;

  clientes: ClienteComOrcamentosDTO[] = [];
  clienteSelecionado: ClienteComOrcamentosDTO | null = null;

  constructor(
    private clienteService: ClienteService,
    private orcamentoService: OrcamentoService,
    private utils: Utils,
    private changeDetector: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.listarClientes();
  }

  selecionarCliente(cliente: ClienteComOrcamentosDTO): void {
    this.clienteSelecionado = cliente;
  }

  formatarDataHora(valor: string | null): string {
    return this.utils.formatarDataHora(valor);
  }

  formatarTelefone(telefone: string): string {
    return StringHelper.formatTelefone(telefone);
  }

  descricaoCidade(valor: string | null): string {
    return this.utils.ouEntao(valor, idioma.APP.CIDADE_NAO_INFORMADA);
  }

  descricaoEstado(valor: string | null): string {
    return this.utils.ouEntao(valor, idioma.APP.ESTADO_NAO_INFORMADO);
  }

  descricaoCodigo(cliente: ClienteComOrcamentosDTO): string {
    return StringHelper.formatString(idioma.CLIENTE.CODIGO, [cliente.id]);
  }

  descricaoQuantidadeOrcamentos(cliente: ClienteComOrcamentosDTO): string {
    return StringHelper.formatString(idioma.CLIENTE.TOTAL_ORCAMENTOS, [cliente.quantidadeOrcamentos]);
  }

  descricaoUltimoOrcamento(cliente: ClienteComOrcamentosDTO): string {

    const valor = cliente.ultimoOrcamento
      ? StringHelper.formatString(idioma.CLIENTE.ULTIMO_ORCAMENTO_VALOR, [
        cliente.ultimoOrcamento.id,
        this.formatarDataHora(cliente.ultimoOrcamento.createdAt)
      ])
      : idioma.CLIENTE.NENHUM;

    return StringHelper.formatString(idioma.CLIENTE.ULTIMO_ORCAMENTO, [valor]);
  }

  descricaoQuantidadeItens(orcamento: OrcamentoDTO): string {
    return StringHelper.formatString(idioma.CLIENTE.TOTAL_ITENS, [orcamento.items.length]);
  }

  ehSemOrcamentos(situacao: string): boolean {
    return situacao === SEM_ORCAMENTOS;
  }

  private listarClientes(): void {

    forkJoin({
      clientes: this.clienteService.listar(),
      orcamentos: this.orcamentoService.listar()
    })
      .pipe(finalize(() => {
        this.flagCarregando = false;
        this.changeDetector.markForCheck();
      }))
      .subscribe({
        next: ({ clientes, orcamentos }) => {

          this.clientes = clientes
            .map(cliente => this.montarCliente(cliente, orcamentos))
            .sort((esquerda, direita) =>
              direita.quantidadeOrcamentos - esquerda.quantidadeOrcamentos
              || esquerda.phone.localeCompare(direita.phone)
            );

          this.clienteSelecionado = this.clientes[0] ?? null;
        },
        error: () => this.flagFalha = true
      });
  }

  private montarCliente(cliente: ClienteComOrcamentosDTO | any, orcamentos: OrcamentoDTO[]): ClienteComOrcamentosDTO {

    const orcamentosCliente = orcamentos
      .filter(orcamento => orcamento.clientId === cliente.id)
      .sort((esquerda, direita) => direita.createdAt.localeCompare(esquerda.createdAt));

    return {
      ...cliente,
      quantidadeOrcamentos: orcamentosCliente.length,
      orcamentos: orcamentosCliente,
      ultimoOrcamento: orcamentosCliente[0] ?? null,
      situacaoPredominante: this.resolverSituacaoPredominante(orcamentosCliente)
    };
  }

  private resolverSituacaoPredominante(orcamentos: OrcamentoDTO[]): string {

    if (orcamentos.length === 0) {
      return SEM_ORCAMENTOS;
    }

    const contagem = new Map<string, number>();

    orcamentos.forEach(orcamento => {
      contagem.set(orcamento.status, (contagem.get(orcamento.status) ?? 0) + 1);
    });

    return [...contagem.entries()].sort((esquerda, direita) => direita[1] - esquerda[1])[0][0];
  }
}
