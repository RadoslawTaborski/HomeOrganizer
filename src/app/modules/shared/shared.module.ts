import { APP_INITIALIZER, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '../translate/translate.module';
import { DataGridComponent } from "./components/data-grid/data-grid.component";
import { DataGridRowComponent } from "./components/data-grid/data-grid-row/data-grid-row.component";
import { SearchComponent } from "./components/search/search.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CamelCaseToSignPipe } from './pipes/camel-case-to-sign/camel-case-to-sign.pipe';
import { ModalConfirmComponent } from './components/modal/confirm/modal-confirm.component';
import { AddComponent } from './components/modal/add/add.component';
import { GridSearchAddComponent } from './components/grid-search-add/grid-search-add.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RegisterComponent } from './components/authentication/account/register/register.component';
import { AuthCallbackComponent } from './components/authentication/auth-callback/auth-callback.component';
import { HomeComponent } from './components/authentication/home/home.component';
import { HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { XhrInterceptor } from './interceptors/xhr-interceptor';
import { AuthGuard } from './services/authentication/auth.guard';
import { ConfigService } from './services/config/config.service';
import { preloadFactory } from './services/config/preload-service.factory';
import { AuthService } from './services/authentication/auth.service';

@NgModule({
  declarations: [
    DataGridComponent,
    DataGridRowComponent,
    SearchComponent,
    CamelCaseToSignPipe,
    ModalConfirmComponent,
    AddComponent,
    GridSearchAddComponent,
    RegisterComponent,
    AuthCallbackComponent,
    HomeComponent
  ],
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule
  ],
  exports: [
    DataGridComponent,
    DataGridRowComponent,
    SearchComponent,
    CamelCaseToSignPipe,
    ModalConfirmComponent,
    AddComponent,
    GridSearchAddComponent,
  ],
  providers: [
    ConfigService,
    AuthService,
    {
      provide: APP_INITIALIZER,
      deps: [HttpClient, ConfigService, AuthService],
      useFactory: preloadFactory,
      multi: true,
    },
    AuthGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: XhrInterceptor,
      multi: true,
    }
  ]
})
export class SharedModule { }
