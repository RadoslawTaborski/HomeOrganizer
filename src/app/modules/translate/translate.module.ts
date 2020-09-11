import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule as Translate } from '@ngx-translate/core';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    Translate
  ],
  exports: [
    Translate
  ]
})
export class TranslateModule { }
