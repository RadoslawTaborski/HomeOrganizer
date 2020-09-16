import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { IShoppingListModel, ShoppingListResolver } from '../services/shopping-lists.service.models'
import { ShoppingListsService } from '../services/shopping-lists.service'

@Injectable({ providedIn: 'root' })
export class ShoppingListDetailsResolver implements ShoppingListResolver<IShoppingListModel> {

    constructor(private service: ShoppingListsService) { }

    resolve(route: ActivatedRouteSnapshot): Promise<IShoppingListModel> {
        return this.service.get(route.params['id'])
    }

}
