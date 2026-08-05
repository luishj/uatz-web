import { DateFormatEnum } from '../enum/date-format.enum';

export class DateHelper {

  static readonly LOCALE = 'pt-BR';

  /**
   * Formata a data no padrao dd/MM/yyyy HH:mm. Aceita o ISO devolvido pela API.
   */
  static formatDateTime(valor: string | Date | null | undefined): string | null {
    const data = this.parse(valor);

    if (!data) {
      return null;
    }

    return new Intl.DateTimeFormat(this.LOCALE, {
      dateStyle: 'short',
      timeStyle: 'short'
    }).format(data);
  }

  static formatDate(valor: string | Date | null | undefined): string | null {
    const data = this.parse(valor);

    if (!data) {
      return null;
    }

    return new Intl.DateTimeFormat(this.LOCALE, { dateStyle: 'short' }).format(data);
  }

  /**
   * Converte a data para o formato aceito pelo banco (yyyy-MM-dd).
   */
  static formatDateDatabase(valor: string | Date | null | undefined): string | null {
    const data = this.parse(valor);

    if (!data) {
      return null;
    }

    const mes = `${data.getMonth() + 1}`.padStart(2, '0');
    const dia = `${data.getDate()}`.padStart(2, '0');

    return `${data.getFullYear()}-${mes}-${dia}`;
  }

  static parse(valor: string | Date | null | undefined): Date | null {
    if (!valor) {
      return null;
    }

    const data = valor instanceof Date ? valor : new Date(valor);

    return isNaN(data.getTime()) ? null : data;
  }

  static get formatos(): typeof DateFormatEnum {
    return DateFormatEnum;
  }
}
