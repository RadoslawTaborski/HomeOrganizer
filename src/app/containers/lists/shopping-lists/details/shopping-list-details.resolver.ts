import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { IShoppingListModel, ShoppingListResolver } from '../services/shopping-lists.service.models'
import { ShoppingListsService } from '../services/shopping-lists.service'
import { DataProviderService } from 'src/app/containers/services/data-provider.service';

@Injectable({ providedIn: 'root' })
export class ShoppingListDetailsResolver implements ShoppingListResolver<IShoppingListModel> {

    constructor(private service: DataProviderService) { }

    async resolve(route: ActivatedRouteSnapshot): Promise<IShoppingListModel> {
        await this.service.init();
        await this.service.reloadCategories();
        await this.service.reloadSubCategories();
        return this.service.getShoppingList(route.params['id'])
    }

}
