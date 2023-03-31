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
import { AuthGuard } from './modules/shared/services/authentication/auth.guard';
import { RegisterComponent } from './modules/shared/components/authentication/account/register/register.component';
import { ListcategoriesComponent } from './containers/settings/listcategories/listcategories.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'auth-callback', component: AuthCallbackComponent },
  { path: 'home', component: HomeComponent },
  { path: 'shopping', component: ShoppingItemsComponent, canActivate: [AuthGuard] },
  { path: 'permanent', component: PermanentItemsComponent, canActivate: [AuthGuard] },
  { path: 'shopping-lists', component: ShoppingListsComponent, canActivate: [AuthGuard] },
  { path: 'finances/saldo', component: SaldoComponent, canActivate: [AuthGuard] },
  { path: 'finances/expenses', component: ExpensesComponent, canActivate: [AuthGuard] },
  { path: 'settings/categories', component: CategoriesComponent, canActivate: [AuthGuard] },
  { path: 'settings/subcategories', component: SubcategoriesComponent, canActivate: [AuthGuard] },
  { path: 'settings/listcategories', component: ListcategoriesComponent, canActivate: [AuthGuard] },
  { path: 'shopping-lists/:id', component: ShoppingListDetailsComponent, resolve: { item: ShoppingListDetailsResolver }, canActivate: [AuthGuard] },
  { path: 'register', component: RegisterComponent },
  { path: '**', redirectTo: 'home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
