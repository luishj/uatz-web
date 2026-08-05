import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { AutenticacaoService } from 'src/app/services/base/autenticacao.service';
import { FormHelper } from 'src/app/static/helpers/form.helper';
import { StringHelper } from 'src/app/static/helpers/string.helper';
import { idioma } from 'src/environments/language/idioma';

@Component({
  standalone: false,
  selector: 'uatz-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent {

  idioma = idioma;

  flagAutenticando = false;
  mensagemErro = StringHelper.STRING_VAZIA;

  form = this._formBuilder.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  constructor(
    private _formBuilder: FormBuilder,
    private autenticacaoService: AutenticacaoService,
    private router: Router,
    private changeDetector: ChangeDetectorRef
  ) { }

  entrar(): void {

    if (this.form.invalid || this.flagAutenticando) {
      FormHelper.markFieldsInvalid(this.form.controls);
      return;
    }

    this.mensagemErro = StringHelper.STRING_VAZIA;
    this.flagAutenticando = true;

    this.autenticacaoService.realizarLogin(this.form.getRawValue())
      .pipe(finalize(() => {
        this.flagAutenticando = false;
        this.changeDetector.markForCheck();
      }))
      .subscribe({
        next: () => void this.router.navigate(['/']),
        error: () => this.mensagemErro = idioma.LOGIN.FALHA
      });
  }
}
