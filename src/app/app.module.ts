import { registerLocaleData } from '@angular/common';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import pt from '@angular/common/locales/pt';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {
  ArrowLeftOutline,
  ArrowRightOutline,
  DeleteOutline,
  FileTextOutline,
  LockOutline,
  LogoutOutline,
  MailOutline,
  MessageOutline,
  PieChartOutline,
  PlusOutline,
  SendOutline,
  ShopOutline,
  TeamOutline
} from '@ant-design/icons-angular/icons';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { pt_BR, provideNzI18n } from 'ng-zorro-antd/i18n';
import { NzIconModule, provideNzIcons } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { HttpConfigInterceptor } from './core/interceptors/interceptor';

registerLocaleData(pt);

/**
 * Icones usados nos templates. Registrar explicitamente evita o carregamento
 * dinamico do ng-zorro (que dependeria dos SVGs em assets) e mantem no bundle
 * apenas o que a aplicacao usa.
 */
const ICONES = [
  ArrowLeftOutline,
  ArrowRightOutline,
  DeleteOutline,
  FileTextOutline,
  LockOutline,
  LogoutOutline,
  MailOutline,
  MessageOutline,
  PieChartOutline,
  PlusOutline,
  SendOutline,
  ShopOutline,
  TeamOutline
];

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    CoreModule,
    NzLayoutModule,
    NzMenuModule,
    NzIconModule,
    NzSpinModule,
    NzTagModule,
    NzButtonModule,
    NzToolTipModule
  ],
  providers: [
    provideNzI18n(pt_BR),
    provideNzIcons(ICONES),
    provideAnimationsAsync(),
    provideHttpClient(withInterceptorsFromDi()),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpConfigInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
