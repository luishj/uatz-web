import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { OrcamentoService } from 'src/app/services/orcamento/orcamento.service';
import { FormHelper } from 'src/app/static/helpers/form.helper';
import { StringHelper } from 'src/app/static/helpers/string.helper';
import { CustomValidators } from 'src/app/static/validators/custom-validators.validator';
import { idioma } from 'src/environments/language/idioma';

@Component({
  standalone: false,
  selector: 'uatz-simulacao-whatsapp',
  templateUrl: './simulacao-whatsapp.component.html',
  styleUrls: ['./simulacao-whatsapp.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SimulacaoWhatsAppComponent {

  idioma = idioma;

  flagSalvando = false;

  form = this._formBuilder.nonNullable.group({
    phone: ['', [Validators.required, Validators.maxLength(30), CustomValidators.telefone()]],
    city: ['', [Validators.maxLength(120)]],
    state: ['', [Validators.maxLength(60), CustomValidators.estado()]],
    message: ['', [Validators.required, Validators.maxLength(4000)]]
  });

  constructor(
    private _formBuilder: FormBuilder,
    private orcamentoService: OrcamentoService,
    private router: Router,
    private changeDetector: ChangeDetectorRef
  ) { }

  simular(): void {

    if (this.form.invalid || this.flagSalvando) {
      FormHelper.markFieldsInvalid(this.form.controls);
      return;
    }

    this.flagSalvando = true;

    const valor = this.form.getRawValue();

    this.orcamentoService.simularWhatsApp({
      phone: valor.phone.trim(),
      city: StringHelper.isNullOrEmpty(valor.city) ? null : valor.city.trim(),
      state: StringHelper.isNullOrEmpty(valor.state) ? null : valor.state.trim().toUpperCase(),
      message: valor.message
    })
      .pipe(finalize(() => {
        this.flagSalvando = false;
        this.changeDetector.markForCheck();
      }))
      .subscribe({
        next: orcamento => void this.router.navigate(['/orcamentos', orcamento.id]),
        error: () => { }
      });
  }
}
