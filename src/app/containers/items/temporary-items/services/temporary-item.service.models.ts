import { SubCategory } from 'src/app/containers/settings/subcategories/services/subcategories.service.models';
import { IItemModel } from "../../models/models";


export enum TemporaryItemTypes {
  BOUGHT = "bought",
  NAME = 'name',
  CATEGORY = 'category',
  SUBCATEGORY = 'subcategory',
  QUANTITY = 'quantity',
  ID = 'id',
  ARCHIVE = "remove"
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
    groupId: string;
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
            groupId: a.groupId,
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

      static toJson(entity: TemporaryItemModel): string{
        var tmp: any = {};
        tmp.id = entity.id;
        tmp.groupId = entity.groupId;
        tmp.createTime = entity.createTime;
        tmp.updateTime = entity.updateTime;
        tmp.deleteTime = entity.deleteTime;
        tmp.name = entity.name;
        tmp.quantity = entity.quantity;
        tmp.shoppingListId = entity.shoppingListId;
        tmp.categoryId = entity.category.id;
        tmp.bought = entity.bought;
        return JSON.stringify(tmp)
    }
}

export type TemporaryItemMethods = 'add' | 'remove' | 'update' | 'more';

export interface TemporaryItemAction {
    type: TemporaryItemMethods
    data: TemporaryItemModel
}

export enum TemporaryItemsFilterTypes {
    CATEGORY = 'categoryId',
    SUBCATEGORY = 'subcategoryId',
}

export class TemporaryItemsFilters {
    constructor(
        public categoryId = '',
        public subcategoryId = '',
        public pageNumber = 1,
        public pageSize = 25,
        public orderBy = "categoryId asc, name asc") {
    }
}