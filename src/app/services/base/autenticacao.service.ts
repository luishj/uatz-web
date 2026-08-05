import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { EndpointsConstant } from 'src/app/static/constants/endpoints.constant';
import { ModuloConstant } from 'src/app/static/constants/modulo.constant';
import { StorageConstant } from 'src/app/static/constants/storage.constant';
import { PerfilEnum, PERFIL_DESCRICAO } from 'src/app/static/enum/perfil.enum';
import { AutenticacaoDTO, LoginDTO } from 'src/app/static/model/autenticacao/autenticacao.dto';
import { Storage } from 'src/app/static/storage/storage';
import { idioma } from 'src/environments/language/idioma';
import { Service } from '../service';

/**
 * Sessao do usuario: login, logout e os dados do usuario autenticado.
 */
@Injectable({
  providedIn: 'root'
})
export class AutenticacaoService extends Service {

  constructor(
    public http: HttpClient,
    private storage: Storage,
    private router: Router
  ) {
    super(http, ModuloConstant.SERVER, ModuloConstant.SERVER.URL);
  }

  realizarLogin(login: LoginDTO): Observable<AutenticacaoDTO> {
    return this.post<AutenticacaoDTO>(EndpointsConstant.AUTENTICACAO.LOGIN, login)
      .pipe(tap(retorno => this.definirDadosUsuario(retorno)));
  }

  definirDadosUsuario(sessao: AutenticacaoDTO): void {
    this.storage.setObject(StorageConstant.SESSAO, sessao);
    this.storage.set(StorageConstant.TOKEN, sessao.accessToken);
  }

  logout(): void {
    this.storage.remove(StorageConstant.SESSAO);
    this.storage.remove(StorageConstant.TOKEN);
    void this.router.navigate(['/public/login']);
  }

  isAuthenticated(): boolean {
    return this.adquirirToken() !== null;
  }

  adquirirToken(): string | null {
    return this.storage.get(StorageConstant.TOKEN);
  }

  adquirirSessao(): AutenticacaoDTO | null {
    return this.storage.getObject<AutenticacaoDTO>(StorageConstant.SESSAO);
  }

  adquirirPerfil(): PerfilEnum | null {
    return this.adquirirSessao()?.role ?? null;
  }

  adquirirDescricaoPerfil(): string {
    const perfil = this.adquirirPerfil();
    return perfil ? PERFIL_DESCRICAO[perfil] : idioma.APP.PAINEL;
  }

  possuiPerfil(...perfis: PerfilEnum[]): boolean {
    const perfil = this.adquirirPerfil();
    return perfil !== null && perfis.includes(perfil);
  }

  isAdmin(): boolean {
    return this.possuiPerfil(PerfilEnum.ADMIN);
  }

  isFornecedor(): boolean {
    return this.possuiPerfil(PerfilEnum.VENDOR);
  }

  isAdminOuOperador(): boolean {
    return this.possuiPerfil(PerfilEnum.ADMIN, PerfilEnum.OPERATOR);
  }
}
