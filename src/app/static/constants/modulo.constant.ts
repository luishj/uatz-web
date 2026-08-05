import { environment } from 'src/environments/environment';

/**
 * Modulos consumidos pelo front. `API` e o root-path do servico e `URL` o
 * endereco base; os dois sao usados pela classe `Service` para montar o path.
 */
export class ModuloConstant {

  static readonly SERVER = {
    CHAVE: 'uatz-server',
    API: 'api',
    URL: environment.urlServidor
  };
}
