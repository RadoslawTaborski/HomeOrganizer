import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PermanentItemsComponent } from './items/permanent-items/permanent-items.component';
import { ModulesModule } from "../modules/modules.module"

@NgModule({
  declarations: [PermanentItemsComponent],
  imports: [
    CommonModule,
    ModulesModule
  ],
  exports: [
    PermanentItemsComponent
  ]
})
export class ContainersModule { }
