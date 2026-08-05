import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AutenticacaoService } from '../services/base/autenticacao.service';

/**
 * Responsavel por controlar a autenticacao do usuario.
 */
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private autenticacaoService: AutenticacaoService,
    private router: Router
  ) { }

  canActivate(): boolean | ReturnType<Router['createUrlTree']> {

    if (this.autenticacaoService.isAuthenticated()) {
      return true;
    }

    return this.router.createUrlTree(['/public/login']);
  }
}
