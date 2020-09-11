import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PermanentItemsComponent } from './items/permanent-items/permanent-items.component';
import { ModulesModule } from "../modules/modules.module"
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";

@NgModule({
  declarations: [
    PermanentItemsComponent,
  ],
  imports: [
    BrowserModule,
    CommonModule,
    ModulesModule,
    NgbModule
  ],
  exports: [
    PermanentItemsComponent
  ]
})
export class ContainersModule { }
