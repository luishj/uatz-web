export class NumberHelper {

  static readonly LOCALE = 'pt-BR';

  /**
   * Formata o valor com duas casas decimais, sem simbolo de moeda.
   */
  static formatToCurrency(valor: number): string {
    return valor.toLocaleString(this.LOCALE, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }

  /**
   * Formata o valor em Real: R$ 1.234,56.
   */
  static toBRL(valor: number | null | undefined): string {
    if (valor === null || valor === undefined) {
      return '0';
    }

    return valor.toLocaleString(this.LOCALE, {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }

  static formatWithDigits(valor: number | null | undefined, digitos: number): string {
    if (valor === null || valor === undefined) {
      return '';
    }

    return valor.toLocaleString(this.LOCALE, {
      minimumFractionDigits: digitos,
      maximumFractionDigits: digitos
    });
  }

  static formatInteger(valor: number | null | undefined): string {
    if (valor === null || valor === undefined) {
      return '';
    }

    return valor.toLocaleString(this.LOCALE, { maximumFractionDigits: 0 });
  }

  static betweenNumber(valor: number, inicio: number, limite: number): boolean {
    return valor >= inicio && valor <= limite;
  }

  /**
   * Converte para numero tratando null, undefined e string vazia como zero.
   */
  static paraNumero(valor: any): number {
    const numero = Number(valor);
    return isNaN(numero) ? 0 : numero;
  }
}
