import { AbstractControl } from '@angular/forms';

export class FormHelper {

  /**
   * Marca todos os controles invalidos como sujos para o ng-zorro exibir o erro.
   */
  static markFieldsInvalid(controls: { [key: string]: AbstractControl } | null | undefined): void {
    if (!controls) {
      return;
    }

    Object.values(controls).forEach((control: AbstractControl) => {
      if (control.invalid) {
        control.markAsDirty();
        control.updateValueAndValidity({ onlySelf: true });
      }
    });
  }
}
