import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PermanentItemsComponent } from './containers/items/permanent-items/permanent-items.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: PermanentItemsComponent },
  { path: '**', redirectTo: 'home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
