import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EndpointsConstant } from 'src/app/static/constants/endpoints.constant';
import { ModuloConstant } from 'src/app/static/constants/modulo.constant';
import { StringHelper } from 'src/app/static/helpers/string.helper';
import {
  OrcamentoDTO,
  OrcamentoFornecedorDTO,
  RevisaoOrcamentoDTO,
  SimulacaoWhatsAppDTO
} from 'src/app/static/model/orcamento/orcamento.dto';
import { Service } from '../service';

@Injectable({
  providedIn: 'root'
})
export class OrcamentoService extends Service {

  constructor(public http: HttpClient) {
    super(http, ModuloConstant.SERVER, ModuloConstant.SERVER.URL);
  }

  listar(): Observable<OrcamentoDTO[]> {
    return this.get<OrcamentoDTO[]>(EndpointsConstant.ORCAMENTO.LISTAR);
  }

  obter(codigo: number): Observable<OrcamentoDTO> {
    return this.get<OrcamentoDTO>(StringHelper.formatString(EndpointsConstant.ORCAMENTO.OBTER, [codigo]));
  }

  revisar(codigo: number, revisao: RevisaoOrcamentoDTO): Observable<OrcamentoDTO> {
    return this.put<OrcamentoDTO>(StringHelper.formatString(EndpointsConstant.ORCAMENTO.REVISAR, [codigo]), revisao);
  }

  distribuir(codigo: number): Observable<OrcamentoFornecedorDTO[]> {
    return this.post<OrcamentoFornecedorDTO[]>(
      StringHelper.formatString(EndpointsConstant.ORCAMENTO.DISTRIBUIR, [codigo]), {}
    );
  }

  listarFornecedores(codigo: number): Observable<OrcamentoFornecedorDTO[]> {
    return this.get<OrcamentoFornecedorDTO[]>(
      StringHelper.formatString(EndpointsConstant.ORCAMENTO.LISTAR_FORNECEDORES, [codigo])
    );
  }

  adquirirMinhaAtribuicao(codigo: number): Observable<OrcamentoFornecedorDTO> {
    return this.get<OrcamentoFornecedorDTO>(
      StringHelper.formatString(EndpointsConstant.ORCAMENTO.MINHA_ATRIBUICAO, [codigo])
    );
  }

  recusar(codigo: number): Observable<void> {
    return this.post<void>(StringHelper.formatString(EndpointsConstant.ORCAMENTO.RECUSAR, [codigo]), {});
  }

  simularWhatsApp(simulacao: SimulacaoWhatsAppDTO): Observable<OrcamentoDTO> {
    return this.post<OrcamentoDTO>(EndpointsConstant.ORCAMENTO.SIMULAR_WHATSAPP, simulacao);
  }
}
