import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { FornecedorService } from 'src/app/services/fornecedor/fornecedor.service';
import { ToastService } from 'src/app/services/toast.service';
import { ArrayHelper } from 'src/app/static/helpers/array.helper';
import { FormHelper } from 'src/app/static/helpers/form.helper';
import { StringHelper } from 'src/app/static/helpers/string.helper';
import { FornecedorDTO, SalvarFornecedorDTO } from 'src/app/static/model/fornecedor/fornecedor.dto';
import { Utils } from 'src/app/static/utils/utils';
import { CustomValidators } from 'src/app/static/validators/custom-validators.validator';
import { idioma } from 'src/environments/language/idioma';

@Component({
  standalone: false,
  selector: 'uatz-fornecedor',
  templateUrl: './fornecedor.component.html',
  styleUrls: ['./fornecedor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FornecedorComponent implements OnInit {

  idioma = idioma;

  flagCarregando = true;
  flagSalvando = false;
  flagFalha = false;

  codigoEmEdicao: number | null = null;
  fornecedores: FornecedorDTO[] = [];

  form = this._formBuilder.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(150)]],
    phone: ['', [Validators.required, Validators.maxLength(30), CustomValidators.telefone()]],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(150)]],
    password: ['', [Validators.minLength(6), Validators.maxLength(100)]],
    city: ['', [Validators.maxLength(120)]],
    state: ['', [Validators.maxLength(60), CustomValidators.estado()]],
    active: [true]
  });

  constructor(
    private _formBuilder: FormBuilder,
    private fornecedorService: FornecedorService,
    private toastService: ToastService,
    private utils: Utils,
    private changeDetector: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.listarFornecedores();
  }

  formatarTelefone(telefone: string): string {
    return StringHelper.formatTelefone(telefone);
  }

  descricaoCidade(valor: string | null): string {
    return this.utils.ouEntao(valor, idioma.APP.CIDADE_NAO_INFORMADA);
  }

  descricaoEstado(valor: string | null): string {
    return this.utils.ouEntao(valor, idioma.APP.ESTADO_NAO_INFORMADO);
  }

  get tituloFormulario(): string {
    return this.codigoEmEdicao ? idioma.FORNECEDOR.EDITAR : idioma.FORNECEDOR.REGISTRAR;
  }

  get rotuloSenha(): string {
    return this.codigoEmEdicao ? idioma.FORNECEDOR.SENHA_NOVA : idioma.FORNECEDOR.SENHA;
  }

  get placeholderSenha(): string {
    return this.codigoEmEdicao ? idioma.FORNECEDOR.SENHA_NOVA_PLACEHOLDER : idioma.FORNECEDOR.SENHA_PLACEHOLDER;
  }

  get rotuloBotaoSalvar(): string {
    return this.codigoEmEdicao ? idioma.FORNECEDOR.SALVAR_ALTERACOES : idioma.FORNECEDOR.SALVAR;
  }

  salvar(): void {

    if (this.form.invalid || this.flagSalvando) {
      FormHelper.markFieldsInvalid(this.form.controls);
      return;
    }

    const valor = this.form.getRawValue();

    if (!this.codigoEmEdicao && StringHelper.isNullOrEmpty(valor.password)) {
      this.toastService.error(idioma.FORNECEDOR.SENHA_OBRIGATORIA);
      return;
    }

    this.flagSalvando = true;

    const fornecedor: SalvarFornecedorDTO = {
      name: valor.name.trim(),
      phone: valor.phone.trim(),
      email: StringHelper.isNullOrEmpty(valor.email) ? null : valor.email.trim(),
      password: StringHelper.isNullOrEmpty(valor.password) ? null : valor.password.trim(),
      city: StringHelper.isNullOrEmpty(valor.city) ? null : valor.city.trim(),
      state: StringHelper.isNullOrEmpty(valor.state) ? null : valor.state.trim().toUpperCase(),
      active: valor.active
    };

    const codigoEmEdicao = this.codigoEmEdicao;

    const $salvar = codigoEmEdicao
      ? this.fornecedorService.atualizar(codigoEmEdicao, fornecedor)
      : this.fornecedorService.salvar(fornecedor);

    $salvar
      .pipe(finalize(() => {
        this.flagSalvando = false;
        this.changeDetector.markForCheck();
      }))
      .subscribe({
        next: retorno => {
          this.atualizarLista(retorno);
          this.toastService.success(
            codigoEmEdicao ? idioma.FORNECEDOR.ATUALIZACAO_SUCESSO : idioma.FORNECEDOR.CADASTRO_SUCESSO
          );
          this.limparFormulario();
        },
        error: () => { }
      });
  }

  editar(fornecedor: FornecedorDTO): void {

    this.codigoEmEdicao = fornecedor.id;

    this.form.setValue({
      name: fornecedor.name,
      phone: fornecedor.phone,
      email: fornecedor.email ?? '',
      password: '',
      city: fornecedor.city ?? '',
      state: fornecedor.state ?? '',
      active: fornecedor.active ?? true
    });
  }

  cancelarEdicao(): void {
    this.limparFormulario();
  }

  alternarSituacao(fornecedor: FornecedorDTO): void {

    this.fornecedorService.atualizar(fornecedor.id, {
      name: fornecedor.name,
      phone: fornecedor.phone,
      email: fornecedor.email,
      password: null,
      city: fornecedor.city,
      state: fornecedor.state,
      active: !fornecedor.active
    })
      .pipe(finalize(() => this.changeDetector.markForCheck()))
      .subscribe({
        next: retorno => {
          this.atualizarLista(retorno);
          this.toastService.success(retorno.active ? idioma.FORNECEDOR.REATIVADO : idioma.FORNECEDOR.INATIVADO);

          if (this.codigoEmEdicao === retorno.id) {
            this.editar(retorno);
          }
        },
        error: () => { }
      });
  }

  private listarFornecedores(): void {
    this.fornecedorService.listar()
      .pipe(finalize(() => {
        this.flagCarregando = false;
        this.changeDetector.markForCheck();
      }))
      .subscribe({
        next: fornecedores => this.fornecedores = ArrayHelper.ordenarPorTexto(fornecedores, 'name'),
        error: () => this.flagFalha = true
      });
  }

  private atualizarLista(fornecedor: FornecedorDTO): void {

    const existente = this.fornecedores.some(item => item.id === fornecedor.id);

    const lista = existente
      ? this.fornecedores.map(item => (item.id === fornecedor.id ? fornecedor : item))
      : [fornecedor, ...this.fornecedores];

    this.fornecedores = ArrayHelper.ordenarPorTexto(lista, 'name');
  }

  private limparFormulario(): void {

    this.codigoEmEdicao = null;

    this.form.reset({
      name: '',
      phone: '',
      email: '',
      password: '',
      city: '',
      state: '',
      active: true
    });
  }
}
