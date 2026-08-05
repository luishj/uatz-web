export class ObjectHelper {

  /**
   * Clone profundo do objeto.
   */
  static clone<T>(objeto: T): T {
    return JSON.parse(JSON.stringify(objeto)) as T;
  }
}
