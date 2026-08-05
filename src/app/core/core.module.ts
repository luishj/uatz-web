import { CommonModule } from '@angular/common';
import { NgModule, Optional, SkipSelf } from '@angular/core';

/**
 * Modulo dos recursos singleton da aplicacao. Deve ser importado apenas pelo
 * `AppModule`.
 */
@NgModule({
  imports: [
    CommonModule
  ]
})
export class CoreModule {

  constructor(@Optional() @SkipSelf() parentModule?: CoreModule) {
    if (parentModule) {
      throw new Error('CoreModule ja foi carregado. Importe somente no AppModule.');
    }
  }
}
