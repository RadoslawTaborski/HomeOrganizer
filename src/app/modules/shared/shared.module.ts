import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TestComponent } from './components/test/test.component';
import { TranslateModule } from '../translate/translate.module';
import { DataGridComponent } from "./components/data-grid/data-grid.component";
import { DataGridRowComponent } from "./components/data-grid/data-grid-row/data-grid-row.component";
import { SearchComponent } from "./components/search/search.component";

@NgModule({
  declarations: [
    DataGridComponent,
    DataGridRowComponent,
    SearchComponent,
    TestComponent
  ],
  imports: [
    CommonModule,
    TranslateModule
  ],
  exports: [
    DataGridComponent,
    DataGridRowComponent,
    SearchComponent,
    TestComponent
  ]
})
export class SharedModule { }
