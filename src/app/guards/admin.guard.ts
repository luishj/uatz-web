import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AutenticacaoService } from '../services/base/autenticacao.service';

/**
 * Libera a rota apenas para o perfil ADMIN.
 */
@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(
    private autenticacaoService: AutenticacaoService,
    private router: Router
  ) { }

  canActivate(): boolean | ReturnType<Router['createUrlTree']> {

    if (this.autenticacaoService.isAdmin()) {
      return true;
    }

    return this.router.createUrlTree(['/']);
  }
}
