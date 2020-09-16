import { SubCategory, IItemModel } from "../../models/models";
import { State } from '../../permanent-items/services/permanent-item.service.models';

export enum ShoppingItemTypes {
  NAME = 'name',
  CATEGORY = 'category',
  SUBCATEGORY = 'subcategory',
  STATE = 'state',
  ID = 'id',
  DATE = "date"
}

export interface IShoppingItemModel extends IItemModel {
    state?: State;
    quantity?: string;
}

export class ShoppingItemModel implements IShoppingItemModel{
    state?: State;
    quantity?: string;
    id: string;
    name: string;
    category: SubCategory;
    date: string

    public constructor(init?:Partial<ShoppingItemModel>) {
        Object.assign(this, init);
    }
}

export type ShoppingItemMethods = 'add' | 'remove' | 'update' | 'more';

export interface ShoppingItemAction {
    type: ShoppingItemMethods 
    data: ShoppingItemModel
}

export enum ShoppingItemsFilterTypes {
    NAME = 'name',
    CATEGORY = 'category',
    SUBCATEGORY = 'subcategory',
}

export class ShoppingItemsFilters {
    constructor(
        public category = '',
        public subcategory = '',
        public currentPage = 1,
        public itemsPerPage = 15) {
    }
}