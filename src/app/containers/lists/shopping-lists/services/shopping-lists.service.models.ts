import { ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { ITemporaryItemModel } from 'src/app/containers/items/temporary-items/services/temporary-item.service.models';

export enum ShoppingListsTypes {
  NAME = 'name',
  CREATED = 'created',
  UPDATED = 'updated',
  ID = 'id',
  MORE = 'more',
  ARCHIVE ='remove'
}

export interface IShoppingListModel  {
    id: string;
    name: string;
    data: ITemporaryItemModel[];
    created: string;
    updated: string;
    archived: boolean;
}

export class ShoppingListModel implements IShoppingListModel{
    id: string;
    name: string;
    data: ITemporaryItemModel[];
    created: string;
    updated: string;
    archived: boolean;

    public constructor(init?:Partial<ShoppingListModel>) {
        Object.assign(this, init);
    }
}

export type ShoppingListsMethods = 'add' | 'remove' | 'update' | 'more';

export interface ShoppingListAction {
    type: ShoppingListsMethods 
    data: ShoppingListModel
}

export class ShoppingListsFilters {
    constructor(
        public currentPage = 1,
        public itemsPerPage = 15) {
    }
}

export interface ShoppingListResolver<T> {
    resolve(route: ActivatedRouteSnapshot): Promise<T>
}
