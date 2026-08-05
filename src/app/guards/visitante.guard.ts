import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AutenticacaoService } from '../services/base/autenticacao.service';

/**
 * Impede que um usuario autenticado volte para as telas publicas.
 */
@Injectable({
  providedIn: 'root'
})
export class VisitanteGuard implements CanActivate {

  constructor(
    private autenticacaoService: AutenticacaoService,
    private router: Router
  ) { }

  canActivate(): boolean | ReturnType<Router['createUrlTree']> {

    if (!this.autenticacaoService.isAuthenticated()) {
      return true;
    }

    return this.router.createUrlTree(['/']);
  }
}
