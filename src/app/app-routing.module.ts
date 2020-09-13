import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PermanentItemsComponent } from './containers/items/permanent-items/permanent-items.component';
import { ShoppingItemsComponent } from './containers/items/shopping-items/shopping-items.component';
import { TemporaryItemsComponent } from './containers/items/temporary-items/temporary-items.component';

const routes: Routes = [
  { path: '', redirectTo: 'shopping', pathMatch: 'full' },
  { path: 'shopping', component: ShoppingItemsComponent },
  { path: 'permanent', component: PermanentItemsComponent },
  { path: 'temporary', component: TemporaryItemsComponent },
  { path: '**', redirectTo: 'shopping' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
