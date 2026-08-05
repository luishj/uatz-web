import { Injectable } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';

/**
 * Notificacoes ao usuario. Toda mensagem deve vir de `idioma.[KEY]`.
 */
@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(private message: NzMessageService) { }

  success(mensagem: string): void {
    this.message.success(mensagem);
  }

  error(mensagem: string): void {
    this.message.error(mensagem);
  }

  warning(mensagem: string): void {
    this.message.warning(mensagem);
  }

  info(mensagem: string): void {
    this.message.info(mensagem);
  }
}
