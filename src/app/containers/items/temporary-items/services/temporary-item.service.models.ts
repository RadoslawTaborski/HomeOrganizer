import { SubCategory, IItemModel } from "../../models/models";

export enum TemporaryItemTypes {
    BOUGHT = "bought",
    NAME = 'name',
    CATEGORY = 'category',
    SUBCATEGORY = 'subcategory',
    QUANTITY = 'quantity',
    ID = 'id',
}

export interface ITemporaryItemModel extends IItemModel {
    quantity: string;
    bought: string;
    shoppingListId: string;
}

export class TemporaryItemModel implements ITemporaryItemModel {
    quantity: string;
    shoppingListId: string;
    id: string;
    name: string;
    category: SubCategory;
    bought: string;
    createTime: string;
    updateTime: string;
    deleteTime: string;

    public constructor(init?: Partial<TemporaryItemModel>) {
        Object.assign(this, init);
    }

    static createFromJson(a: any, subcategories:SubCategory[]): TemporaryItemModel {
        return new TemporaryItemModel ({
            id: a.id,
            name: a.name,
            shoppingListId: a.shoppingListId,
            category: subcategories.filter(i => i.id === a.categoryId)[0],
            quantity: a.quantity,
            bought: a.bought,
            createTime: a.createTime,
            updateTime: a.updateTime,
            deleteTime: a.deleteTime,
        });
      }
}

export type TemporaryItemMethods = 'add' | 'remove' | 'update' | 'more';

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