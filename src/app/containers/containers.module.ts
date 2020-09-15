import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PermanentItemsComponent } from './items/permanent-items/permanent-items.component';
import { ModulesModule } from "../modules/modules.module"
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { TemporaryItemsComponent } from './items/temporary-items/temporary-items.component';
import { ShoppingItemsComponent } from './items/shopping-items/shopping-items.component';
import { SidebarModule } from 'ng-sidebar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ShoppingListsComponent } from './lists/shopping-lists/shopping-lists.component';

@NgModule({
  declarations: [
    PermanentItemsComponent,
    TemporaryItemsComponent,
    ShoppingItemsComponent,
    ShoppingListsComponent,
  ],
  imports: [
    BrowserModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ModulesModule,
    NgbModule,
    SidebarModule.forRoot(),
  ],
  exports: [
    PermanentItemsComponent
  ]
})
export class ContainersModule { }
