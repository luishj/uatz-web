import { Injectable } from '@angular/core';
import { idioma } from 'src/environments/language/idioma';
import { DateHelper } from '../helpers/date.helper';
import { NumberHelper } from '../helpers/number.helper';
import { StringHelper } from '../helpers/string.helper';

/**
 * Servico utilitario de uso geral nos componentes. Para o que e puramente
 * estatico prefira os helpers de `static/helpers`.
 */
@Injectable({
  providedIn: 'root'
})
export class Utils {

  isNullOrEmpty(texto: string | null | undefined): boolean {
    return StringHelper.isNullOrEmpty(texto);
  }

  /**
   * Valor monetario formatado, ou `--` quando nao informado.
   */
  formatarValor(valor: number | null | undefined): string {
    if (valor === null || valor === undefined) {
      return idioma.APP.VAZIO;
    }

    return NumberHelper.toBRL(valor);
  }

  /**
   * Data e hora formatadas, ou `--` quando nao informada.
   */
  formatarDataHora(valor: string | Date | null | undefined): string {
    return DateHelper.formatDateTime(valor) ?? idioma.APP.VAZIO;
  }

  /**
   * Data formatada, ou `--` quando nao informada.
   */
  formatarData(valor: string | Date | null | undefined): string {
    return DateHelper.formatDate(valor) ?? idioma.APP.VAZIO;
  }

  /**
   * Texto informado ou o valor padrao quando ele estiver vazio.
   */
  ouEntao(texto: string | null | undefined, valorPadrao: string = idioma.APP.NAO_INFORMADO): string {
    return StringHelper.ouEntao(texto, valorPadrao);
  }
}
