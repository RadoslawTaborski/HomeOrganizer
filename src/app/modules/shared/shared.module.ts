import { NgModule } from '@angular/core';
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

@NgModule({
  declarations: [
    DataGridComponent,
    DataGridRowComponent,
    SearchComponent,
    CamelCaseToSignPipe,
    ModalConfirmComponent,
    AddComponent,
    GridSearchAddComponent,
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
    GridSearchAddComponent
  ]
})
export class SharedModule { }
