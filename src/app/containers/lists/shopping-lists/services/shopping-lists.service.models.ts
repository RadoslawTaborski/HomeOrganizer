import { ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { IModel, SubCategory } from 'src/app/containers/items/models/models';
import { ITemporaryItemModel, TemporaryItemModel } from 'src/app/containers/items/temporary-items/services/temporary-item.service.models';

export enum ShoppingListsTypes {
    NAME = 'name',
    CREATED = 'created',
    UPDATED = 'updated',
    ID = 'id',
    MORE = 'more',
    ARCHIVE = 'remove'
}

export interface IShoppingListModel extends IModel {
    id: string;
    name: string;
    data: ITemporaryItemModel[];
    createTime: string;
    updateTime: string;
    deleteTime: string;
}

export class ShoppingListModel implements IShoppingListModel {
    id: string;
    name: string;
    data: ITemporaryItemModel[];
    createTime: string;
    updateTime: string;
    deleteTime: string;

    public constructor(init?: Partial<ShoppingListModel>) {
        Object.assign(this, init);
    }

    static createFromJson(a: any, data: ITemporaryItemModel[]): ShoppingListModel {
        return new ShoppingListModel({
            id: a.id,
            name: a.name,
            data: data.filter(i => i.shoppingListId === a.id),
            createTime: a.createTime,
            updateTime: a.updateTime,
            deleteTime: a.deleteTime,
        });
    }
}

export type ShoppingListsMethods = 'add' | 'remove' | 'update' | 'more';

export interface ShoppingListAction {
    type: ShoppingListsMethods
    data: ShoppingListModel
}

export class ShoppingListsFilters {
    constructor(
        public pageNumber = 1,
        public pageSize = 15) {
    }
}

export interface ShoppingListResolver<T> {
    resolve(route: ActivatedRouteSnapshot): Promise<T>
}
