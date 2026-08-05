import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EndpointsConstant } from 'src/app/static/constants/endpoints.constant';
import { ModuloConstant } from 'src/app/static/constants/modulo.constant';
import { StringHelper } from 'src/app/static/helpers/string.helper';
import {
  CotacaoDetalheDTO,
  CotacaoDTO,
  CotacaoResumoDTO,
  NovaCotacaoDTO
} from 'src/app/static/model/cotacao/cotacao.dto';
import { Service } from '../service';

@Injectable({
  providedIn: 'root'
})
export class CotacaoService extends Service {

  constructor(public http: HttpClient) {
    super(http, ModuloConstant.SERVER, ModuloConstant.SERVER.URL);
  }

  salvar(cotacao: NovaCotacaoDTO): Observable<CotacaoDTO> {
    return this.post<CotacaoDTO>(EndpointsConstant.COTACAO.SALVAR, cotacao);
  }

  adquirirResumoPorOrcamento(codigoOrcamento: number): Observable<CotacaoResumoDTO> {
    return this.get<CotacaoResumoDTO>(
      StringHelper.formatString(EndpointsConstant.COTACAO.RESUMO_POR_ORCAMENTO, [codigoOrcamento])
    );
  }

  adquirirMinhaPorOrcamento(codigoOrcamento: number): Observable<CotacaoDetalheDTO> {
    return this.get<CotacaoDetalheDTO>(
      StringHelper.formatString(EndpointsConstant.COTACAO.MINHA_POR_ORCAMENTO, [codigoOrcamento])
    );
  }
}
