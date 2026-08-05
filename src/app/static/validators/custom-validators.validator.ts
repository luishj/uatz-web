import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { StringHelper } from '../helpers/string.helper';

export class CustomValidators {

  /**
   * Obrigatorio ignorando texto composto apenas de espacos.
   */
  static obrigatorio(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      return StringHelper.isNullOrEmpty(control.value) ? { required: true } : null;
    };
  }

  /**
   * Telefone brasileiro com 10 ou 11 digitos.
   */
  static telefone(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (StringHelper.isNullOrEmpty(control.value)) {
        return null;
      }

      const numeros = StringHelper.somenteNumeros(control.value);

      return numeros.length === 10 || numeros.length === 11 ? null : { telefone: true };
    };
  }

  /**
   * Sigla de estado com duas letras.
   */
  static estado(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (StringHelper.isNullOrEmpty(control.value)) {
        return null;
      }

      return /^[A-Za-z]{2}$/.test(control.value) ? null : { estado: true };
    };
  }
}
