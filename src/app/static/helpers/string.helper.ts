export class StringHelper {

  static readonly STRING_VAZIA = '';

  /**
   * Substitui os marcadores `{0}`, `{1}`, ... pelos parametros informados.
   *
   * `StringHelper.formatString('budget-requests/{0}', [10])` -> `budget-requests/10`
   */
  static formatString(texto: string, params: any): string {
    return texto.replace(/{(\d+)}/g, (match, index) => {
      return typeof params[index] !== 'undefined' ? params[index] : match;
    });
  }

  static isNullOrEmpty(texto: string | null | undefined): boolean {
    return texto === null || texto === undefined || texto.trim() === this.STRING_VAZIA;
  }

  /**
   * Retorna o texto ou o valor informado quando ele estiver vazio.
   */
  static ouEntao(texto: string | null | undefined, valorPadrao: string): string {
    return this.isNullOrEmpty(texto) ? valorPadrao : (texto as string);
  }

  static titleCase(texto: string): string {
    if (this.isNullOrEmpty(texto)) {
      return texto;
    }

    return texto
      .toLowerCase()
      .split(' ')
      .map(palavra => palavra.charAt(0).toUpperCase() + palavra.slice(1))
      .join(' ');
  }

  static sliceString(texto: string, tamanho: number = 20): string {
    if (this.isNullOrEmpty(texto) || texto.length <= tamanho) {
      return texto;
    }

    return `${texto.substring(0, tamanho)}...`;
  }

  /**
   * Mantem apenas os digitos do texto.
   */
  static somenteNumeros(texto: string): string {
    if (this.isNullOrEmpty(texto)) {
      return this.STRING_VAZIA;
    }

    return texto.replace(/[^0-9]/g, this.STRING_VAZIA);
  }

  /**
   * Formata um telefone brasileiro: (11) 99999-9999 ou (11) 9999-9999.
   */
  static formatTelefone(telefone: string | null | undefined): string {
    const numeros = this.somenteNumeros(telefone ?? this.STRING_VAZIA);

    if (numeros.length === 11) {
      return `(${numeros.substring(0, 2)}) ${numeros.substring(2, 7)}-${numeros.substring(7)}`;
    }

    if (numeros.length === 10) {
      return `(${numeros.substring(0, 2)}) ${numeros.substring(2, 6)}-${numeros.substring(6)}`;
    }

    return telefone ?? this.STRING_VAZIA;
  }
}
