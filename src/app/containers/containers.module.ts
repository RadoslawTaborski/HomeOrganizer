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
import { ShoppingListDetailsComponent } from './lists/shopping-lists/details/shopping-list-details.component';
import { CategoriesComponent } from './settings/categories/categories.component';
import { SubcategoriesComponent } from './settings/subcategories/subcategories.component';
import { StatesComponent } from './settings/states/states.component';
import { ExpensesComponent } from './finances/expenses/expenses.component';
import { SaldoComponent } from './finances/saldo/saldo.component';
import { ExpensesSettingsComponent } from './finances/expenses-settings/expenses-settings.component';

@NgModule({
  declarations: [
    PermanentItemsComponent,
    TemporaryItemsComponent,
    ShoppingItemsComponent,
    ShoppingListsComponent,
    ShoppingListDetailsComponent,
    CategoriesComponent,
    SubcategoriesComponent,
    StatesComponent,
    ExpensesComponent,
    SaldoComponent,
    ExpensesSettingsComponent,
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
