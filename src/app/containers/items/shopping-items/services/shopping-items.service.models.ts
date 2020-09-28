import { SubCategory, IItemModel } from "../../models/models";
import { State } from '../../permanent-items/services/permanent-item.service.models';

export enum ShoppingItemTypes {
    BOUGHT = 'bought',
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
    bought?: string;
}

export class ShoppingItemModel implements IShoppingItemModel {
    state?: State;
    quantity?: string;
    bought?: string;
    id: string;
    name: string;
    category: SubCategory;
    createTime: string;
    updateTime: string;
    deleteTime: string;

    public constructor(init?: Partial<ShoppingItemModel>) {
        Object.assign(this, init);
    }

    static createFromJson(a: any, states: State[], subcategories: SubCategory[]): ShoppingItemModel {
        return new ShoppingItemModel({
            id: a.id,
            name: a.name,
            category: subcategories.filter(i => i.id === a.categoryId)[0],
            quantity: a.quantity,
            bought: a.bought,
            state: states.filter(i => i.id === a.stateId)[0],
            createTime: a.createTime,
            updateTime: a.updateTime,
            deleteTime: a.deleteTime,
        });
    }
}

export type ShoppingItemMethods = 'add' | 'remove' | 'update' | 'more';

export interface ShoppingItemAction {
    type: ShoppingItemMethods
    data: ShoppingItemModel
}

export enum ShoppingItemsFilterTypes {
    CATEGORY = 'categoryId',
    SUBCATEGORY = 'subcategoryId',
}

export class ShoppingItemsFilters {
    constructor(
        public categoryId = '',
        public subcategoryId = '',
        public pageNumber = 1,
        public pageSize = 15) {
    }
}