export class ArrayHelper {

  /**
   * Agrupa a lista pelo campo informado.
   */
  static groupBy<T>(lista: T[], campo: keyof T): Map<any, T[]> {
    const grupos = new Map<any, T[]>();

    lista.forEach(item => {
      const chave = item[campo];
      const grupo = grupos.get(chave) ?? [];
      grupo.push(item);
      grupos.set(chave, grupo);
    });

    return grupos;
  }

  /**
   * Ordena por um campo texto, sem alterar a lista original.
   */
  static ordenarPorTexto<T>(lista: T[], campo: keyof T): T[] {
    return [...lista].sort((esquerda, direita) =>
      String(esquerda[campo] ?? '').localeCompare(String(direita[campo] ?? ''))
    );
  }

  /**
   * Ordena por um campo texto de forma decrescente, sem alterar a original.
   */
  static ordenarPorTextoDesc<T>(lista: T[], campo: keyof T): T[] {
    return [...lista].sort((esquerda, direita) =>
      String(direita[campo] ?? '').localeCompare(String(esquerda[campo] ?? ''))
    );
  }
}
