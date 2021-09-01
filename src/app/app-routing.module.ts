import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ExpensesComponent } from './containers/finances/expenses/expenses.component';
import { SaldoComponent } from './containers/finances/saldo/saldo.component';
import { HomeComponent } from './modules/shared/components/authentication/home/home.component';
import { PermanentItemsComponent } from './containers/items/permanent-items/permanent-items.component';
import { ShoppingItemsComponent } from './containers/items/shopping-items/shopping-items.component';
import { ShoppingListDetailsComponent } from './containers/lists/shopping-lists/details/shopping-list-details.component';
import { ShoppingListDetailsResolver } from './containers/lists/shopping-lists/details/shopping-list-details.resolver';
import { ShoppingListsComponent } from './containers/lists/shopping-lists/shopping-lists.component';
import { CategoriesComponent } from './containers/settings/categories/categories.component';
import { SubcategoriesComponent } from './containers/settings/subcategories/subcategories.component';
import { AuthCallbackComponent } from './modules/shared/components/authentication/auth-callback/auth-callback.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'auth-callback', component: AuthCallbackComponent  },
  { path: 'home', component: HomeComponent  },
  { path: 'shopping', component: ShoppingItemsComponent },
  { path: 'permanent', component: PermanentItemsComponent },
  { path: 'shopping-lists', component: ShoppingListsComponent },
  { path: 'finances/saldo', component: SaldoComponent },
  { path: 'finances/expenses', component: ExpensesComponent },
  { path: 'settings/categories', component: CategoriesComponent },
  { path: 'settings/subcategories', component: SubcategoriesComponent },
  { path: 'shopping-lists/:id', component: ShoppingListDetailsComponent, resolve: { item: ShoppingListDetailsResolver} },
  { path: '**', redirectTo: 'home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
