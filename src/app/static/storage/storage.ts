import { Injectable } from '@angular/core';
import { EncrDecrUtil } from '../encr-decr.util';

/**
 * Wrapper do localStorage. Chave e valor sao cifrados pelo `EncrDecrUtil`.
 */
@Injectable({
  providedIn: 'root'
})
export class Storage {

  constructor(private encrDecr: EncrDecrUtil) { }

  get(chave: string): string | null {
    const valor = localStorage.getItem(this.encrDecr.encrypt(chave));
    return this.encrDecr.decrypt(valor);
  }

  /**
   * Le a chave e devolve o objeto desserializado.
   */
  getObject<T>(chave: string): T | null {
    const valor = this.get(chave);

    if (!valor) {
      return null;
    }

    try {
      return JSON.parse(valor) as T;
    } catch {
      this.remove(chave);
      return null;
    }
  }

  set(chave: string, valor: string): void {
    localStorage.setItem(this.encrDecr.encrypt(chave), this.encrDecr.encrypt(valor));
  }

  setObject(chave: string, valor: any): void {
    this.set(chave, JSON.stringify(valor));
  }

  remove(chave: string): void {
    localStorage.removeItem(this.encrDecr.encrypt(chave));
  }

  clear(): void {
    localStorage.clear();
  }

  getAndRemove(chave: string): string | null {
    const valor = this.get(chave);
    this.remove(chave);
    return valor;
  }
}
