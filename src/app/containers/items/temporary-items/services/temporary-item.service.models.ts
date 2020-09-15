import { SubCategory, IItemModel } from "../../models/models";

export enum TemporaryItemTypes {
  NAME = 'name',
  CATEGORY = 'category',
  SUBCATEGORY = 'subcategory',
  QUANTITY = 'quantity',
  ID = 'id',
}

export interface ITemporaryItemModel extends IItemModel {
    quantity: string;
}

export class TemporaryItemModel implements ITemporaryItemModel{
    quantity: string;
    id: string;
    name: string;
    category: SubCategory;
    date: string

    public constructor(init?:Partial<TemporaryItemModel>) {
        Object.assign(this, init);
    }
}

export type TemporaryItemMethods = 'add' | 'remove' | 'update' | 'more' ;

export interface TemporaryItemAction {
    type: TemporaryItemMethods 
    data: TemporaryItemModel
}

export enum TemporaryItemsFilterTypes {
    NAME = 'name',
    CATEGORY = 'category',
    SUBCATEGORY = 'subcategory',
}

export class TemporaryItemsFilters {
    constructor(
        public name = '',
        public category = '',
        public subcategory = '',
        public quantity = '',
        public currentPage = 1,
        public itemsPerPage = 15) {
    }
}