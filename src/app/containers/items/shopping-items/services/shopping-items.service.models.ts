import { State } from 'src/app/containers/settings/states/services/states.service.models';
import { SubCategory } from 'src/app/containers/settings/subcategories/services/subcategories.service.models';
import { IItemModel } from "../../models/models";

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
    counter: number;
    shoppingListId?: string;
    visible?: boolean;
    archieved?: string;
}

export class ShoppingItemModel implements IShoppingItemModel {
    state?: State;
    quantity?: string;
    bought?: string;
    counter: number;
    shoppingListId?: string;
    groupId: string;
    id: string;
    name: string;
    visible?: boolean;
    archieved?: string;
    category: SubCategory;
    createTime: string;
    updateTime: string;
    deleteTime: string;

    public constructor(init?: Partial<ShoppingItemModel>) {
        Object.assign(this, init);
    }

    static createFromJson(a: any, states: State[], subcategories: SubCategory[]): ShoppingItemModel {
        return new ShoppingItemModel({
            id: a.uuid,
            name: a.name,
            category: subcategories.filter(i => i.id === a.categoryUuid)[0],
            shoppingListId: a.shoppingListUuid,
            quantity: a.quantity,
            bought: a.bought,
            groupId: a.groupUuid,
            counter: a.counter,
            state: states.filter(i => i.id === a.stateUuid)[0],
            visible: a.visible,
            archieved: a.archieved,
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
    CATEGORY = 'categoryUuid',
    SUBCATEGORY = 'subcategoryUuid',
}

export class ShoppingItemsFilters {
    constructor(
        public categoryUuid = '',
        public subcategoryUuid = '',
        public pageNumber = 1,
        public pageSize = 50,
        public orderBy = "categoryUuid asc, name asc") {
    }
}