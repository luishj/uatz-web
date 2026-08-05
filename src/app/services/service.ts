import { HttpClient, HttpContext, HttpHeaders, HttpParams } from '@angular/common/http';

export interface HttpOptions {
    headers?: HttpHeaders | {
        [header: string]: string | string[];
    };
    context?: HttpContext;
    observe?: 'body';
    params?: HttpParams | {
        [param: string]: string | number | boolean | ReadonlyArray<string | number | boolean>;
    };
    reportProgress?: boolean;
    responseType?: 'json';
    withCredentials?: boolean;
}

/**
 * Classe base dos servicos de dominio. Monta o path a partir do modulo e expoe
 * os verbos HTTP tipados.
 *
 * ```typescript
 * export class MeuService extends Service {
 *   constructor(public http: HttpClient) {
 *     super(http, ModuloConstant.SERVER, ModuloConstant.SERVER.URL);
 *   }
 * }
 * ```
 */
export abstract class Service {

    public _api = '';
    public _urlModulo = '';
    private _http: HttpClient;

    constructor(http: HttpClient, public modulo: any, public urlModulo: string) {
        this._http = http;
        this._api = modulo.API;
        this._urlModulo = urlModulo;
    }

    updateModulo(modulo: any, urlModulo: string) {
        this._api = modulo.API;
        this._urlModulo = urlModulo;
    }

    public get<T>(path: string, options?: HttpOptions) {
        return this._http.get<T>(this.buildPath(path), <Object>options);
    }

    public post<T>(path: string, body?: any, options?: HttpOptions) {
        return this._http.post<T>(this.buildPath(path), body, <Object>options);
    }

    public put<T>(path: string, body?: any, options?: HttpOptions) {
        return this._http.put<T>(this.buildPath(path), body, <Object>options);
    }

    public delete<T>(path: string, options?: HttpOptions) {
        return this._http.delete<T>(this.buildPath(path), <Object>options);
    }

    private buildPath(path: string) {

        if (this._urlModulo.length > 0 && this._urlModulo[this._urlModulo.length - 1] == '/') {
            return `${this._urlModulo}${this._api}/${path}`;
        } else {
            return `${this._urlModulo}/${this._api}/${path}`;
        }
    }
}
