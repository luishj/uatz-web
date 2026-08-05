import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { AutenticacaoService } from 'src/app/services/base/autenticacao.service';
import { LoaderService } from 'src/app/services/loader.service';
import { ToastService } from 'src/app/services/toast.service';
import { HeadersConstant } from 'src/app/static/constants/headers.constant';
import { ExcecaoServerModel, ExcecaoValidacaoModel } from 'src/app/static/model/excecao-server.model';
import { environment } from 'src/environments/environment';
import { idioma } from 'src/environments/language/idioma';
import { endPointsWithoutFeedBack } from './interceptor.utils';

/**
 * Anexa o token, controla o loader global e traduz o erro do servidor em toast.
 */
@Injectable({ providedIn: 'root' })
export class HttpConfigInterceptor implements HttpInterceptor {

  private requests: Array<HttpRequest<any>> = [];

  constructor(
    private autenticacaoService: AutenticacaoService,
    private toastService: ToastService,
    private loaderService: LoaderService
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    request = this.setHeaders(request);

    if (environment.desenvolvimento && request.url.startsWith('/')) {
      request = request.clone({ url: `${environment.urlServidor}${request.url}` });
    }

    const comFeedback = this.possuiFeedback(request);

    if (comFeedback) {
      this.requests.push(request);
      this.loaderService.isLoading.next(true);
    }

    return next.handle(request).pipe(
      finalize(() => this.removeRequest(request)),
      catchError((httpError: HttpErrorResponse) => {

        this.removeRequest(request);

        if (httpError.status === 401) {
          this.autenticacaoService.logout();

          if (comFeedback) {
            this.toastService.error(idioma.EXCECAO.SESSAO_EXPIRADA);
          }

          return throwError(() => httpError);
        }

        if (comFeedback) {
          this.toastService.error(this.adquirirMensagem(httpError));
        }

        return throwError(() => httpError);
      })
    );
  }

  private setHeaders(request: HttpRequest<any>): HttpRequest<any> {

    const token = this.autenticacaoService.adquirirToken();

    if (!token) {
      return request;
    }

    return request.clone({
      setHeaders: {
        [HeadersConstant.AUTHORIZATION]: `${HeadersConstant.BEARER} ${token}`
      }
    });
  }

  /**
   * Extrai a mensagem do `ApiErrorResponse` ou do mapper de validacao do Quarkus.
   */
  private adquirirMensagem(httpError: HttpErrorResponse): string {

    if (httpError.status === 0) {
      return idioma.EXCECAO.SERVIDOR_INDISPONIVEL;
    }

    if (httpError.status === 403) {
      return idioma.EXCECAO.SEM_PERMISSAO;
    }

    const validacao = httpError.error as ExcecaoValidacaoModel;

    if (validacao?.violations?.length) {
      return validacao.violations.map(violacao => violacao.message).join(' ');
    }

    const excecao = httpError.error as ExcecaoServerModel;

    if (excecao?.message) {
      return excecao.message;
    }

    return idioma.EXCECAO.FALHA_SERVIDOR;
  }

  private possuiFeedback(request: HttpRequest<any>): boolean {
    return !endPointsWithoutFeedBack.some(endpoint => request.url.includes(endpoint))
      && !request.headers.has(HeadersConstant.SKIP_LOADING);
  }

  private removeRequest(request: HttpRequest<any>): void {

    const indice = this.requests.indexOf(request);

    if (indice >= 0) {
      this.requests.splice(indice, 1);
    }

    this.loaderService.isLoading.next(this.requests.length > 0);
  }
}
