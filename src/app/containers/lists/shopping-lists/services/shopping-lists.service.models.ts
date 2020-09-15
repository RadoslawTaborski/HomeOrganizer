export enum ShoppingListsTypes {
  NAME = 'name',
  CREATED = 'created',
  UPDATED = 'updated',
  ID = 'id',
}

export interface IShoppingListModel  {
    id: string;
    name: string;
    created: string;
    updated: string;
}

export class ShoppingListModel implements IShoppingListModel{
    id: string;
    name: string;
    created: string;
    updated: string;

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