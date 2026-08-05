import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { idioma } from 'src/environments/language/idioma';
import { AutenticacaoService } from './services/base/autenticacao.service';
import { LoaderService } from './services/loader.service';

/**
 * Shell da aplicacao: menu lateral, dados da sessao e o loader global. As telas
 * publicas (login) sao renderizadas sem o shell.
 */
@Component({
  standalone: false,
  selector: 'uatz-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit, OnDestroy {

  idioma = idioma;

  flagRotaPublica = false;
  flagCarregando = false;

  private _subscriptions = new Subscription();

  constructor(
    private autenticacaoService: AutenticacaoService,
    private loaderService: LoaderService,
    private router: Router,
    private changeDetector: ChangeDetectorRef
  ) { }

  ngOnInit(): void {

    this.definirRotaPublica(this.router.url);

    this._subscriptions.add(
      this.router.events
        .pipe(filter((evento): evento is NavigationEnd => evento instanceof NavigationEnd))
        .subscribe(evento => {
          this.definirRotaPublica(evento.urlAfterRedirects);
          this.changeDetector.markForCheck();
        })
    );

    this._subscriptions.add(
      this.loaderService.isLoading.subscribe(carregando => {
        this.flagCarregando = carregando;
        this.changeDetector.markForCheck();
      })
    );
  }

  ngOnDestroy(): void {
    this._subscriptions.unsubscribe();
  }

  get nomeUsuario(): string {
    return this.autenticacaoService.adquirirSessao()?.name ?? '';
  }

  get emailUsuario(): string {
    return this.autenticacaoService.adquirirSessao()?.email ?? '';
  }

  get descricaoPerfil(): string {
    return this.autenticacaoService.adquirirDescricaoPerfil();
  }

  get flagAdmin(): boolean {
    return this.autenticacaoService.isAdmin();
  }

  get flagAdminOuOperador(): boolean {
    return this.autenticacaoService.isAdminOuOperador();
  }

  logout(): void {
    this.autenticacaoService.logout();
  }

  private definirRotaPublica(url: string): void {
    this.flagRotaPublica = url.startsWith('/public');
  }
}
