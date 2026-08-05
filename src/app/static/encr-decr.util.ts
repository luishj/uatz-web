import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

/**
 * Cifra os dados gravados no localStorage.
 *
 * ATENCAO: como a chave fica no bundle do front, isso ofusca o conteudo mas nao
 * protege de quem tem acesso ao navegador. Nunca grave dado sensivel no
 * `Storage` contando com esta camada.
 */
@Injectable({
  providedIn: 'root'
})
export class EncrDecrUtil {

  private readonly _chave = CryptoJS.enc.Utf8.parse('uatz-web-storage');

  private readonly _iv = CryptoJS.enc.Utf8.parse('uatz-web-vetor01');

  encrypt(valor: string | null | undefined): string {
    if (valor === null || valor === undefined) {
      return '';
    }

    const cifrado = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(valor), this._chave, {
      iv: this._iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });

    return cifrado.toString();
  }

  decrypt(valor: string | null | undefined): string | null {
    if (valor === null || valor === undefined || valor === '') {
      return null;
    }

    try {
      const decifrado = CryptoJS.AES.decrypt(valor, this._chave, {
        iv: this._iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      });

      const texto = decifrado.toString(CryptoJS.enc.Utf8);

      return texto === '' ? null : texto;
    } catch {
      return null;
    }
  }
}
