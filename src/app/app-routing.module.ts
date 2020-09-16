import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PermanentItemsComponent } from './containers/items/permanent-items/permanent-items.component';
import { ShoppingItemsComponent } from './containers/items/shopping-items/shopping-items.component';
import { TemporaryItemsComponent } from './containers/items/temporary-items/temporary-items.component';
import { ShoppingListDetailsComponent } from './containers/lists/shopping-lists/details/shopping-list-details.component';
import { ShoppingListDetailsResolver } from './containers/lists/shopping-lists/details/shopping-list-details.resolver';
import { ShoppingListsComponent } from './containers/lists/shopping-lists/shopping-lists.component';

const routes: Routes = [
  { path: '', redirectTo: 'shopping', pathMatch: 'full' },
  { path: 'shopping', component: ShoppingItemsComponent },
  { path: 'permanent', component: PermanentItemsComponent },
  { path: 'shopping-lists', component: ShoppingListsComponent },
  { path: 'shopping-lists/:id', component: ShoppingListDetailsComponent, resolve: { item: ShoppingListDetailsResolver} },
  { path: '**', redirectTo: 'shopping' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
