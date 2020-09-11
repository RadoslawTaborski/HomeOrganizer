import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from './translate/translate.module';
import { SharedModule } from './shared/shared.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  exports: [
    TranslateModule,
    SharedModule
  ]
})
export class ModulesModule { }
