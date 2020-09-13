import { SubCategory, IItemModel } from "../../models/models";

export enum State {
    CRITICAL,
    LITTLE,
    MEDIUM,
    LOT
}

export enum PermanentItemTypes {
    NAME = 'name',
    CATEGORY = 'category',
    SUBCATEGORY = 'subcategory',
    STATE = 'state',
    ID = 'id'
}

export interface IPermanentItemModel extends IItemModel {
    state: State;
}

export class PermanentItemModel implements IPermanentItemModel{
    state: State;
    id: string;
    name: string;
    category: SubCategory;

    public constructor(init?:Partial<PermanentItemModel>) {
        Object.assign(this, init);
    }
}

export type PermanentItemMethods = 'add' | 'remove' | 'update' | 'more' | 'state';

export interface PermanentItemAction {
    type: PermanentItemMethods 
    data: PermanentItemModel
}

export enum PermanentItemsFilterTypes {
    NAME = 'name',
    CATEGORY = 'category',
    SUBCATEGORY = 'subcategory',
    STATE = 'state'
}

export class PermanentItemsFilters {
    constructor(
        public name = '',
        public category = '',
        public subcategory = '',
        public state = '',
        public currentPage = 1,
        public itemsPerPage = 15) {
    }
}