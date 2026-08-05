/**
 * Corpo do erro devolvido pelo `ErrorMapper` do uatz-server.
 */
export interface ExcecaoServerModel {
  status: number;
  message: string;
  timestamp: string;
  errors: ExcecaoCampoModel[];
}

export interface ExcecaoCampoModel {
  field: string;
  message: string;
}

/**
 * Corpo devolvido pelo mapper nativo do Quarkus nas falhas de bean validation.
 */
export interface ExcecaoValidacaoModel {
  title: string;
  status: number;
  violations: ExcecaoViolacaoModel[];
}

export interface ExcecaoViolacaoModel {
  field: string;
  message: string;
}
