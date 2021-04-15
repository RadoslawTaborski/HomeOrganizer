import { SubCategory } from 'src/app/containers/settings/subcategories/services/subcategories.service.models';
import { IItemModel } from "../../models/models";


export enum TemporaryItemTypes {
  BOUGHT = "boughtCheckbox",
  NAME = 'name',
  CATEGORY = 'category',
  SUBCATEGORY = 'subcategory',
  QUANTITY = 'quantity',
  ID = 'id',
  ARCHIVE = "remove"
}

export interface ITemporaryItemModel extends IItemModel {
    boughtCheckbox?: boolean
    quantity: string;
    bought: string;
    shoppingListId: string;
}

export class TemporaryItemModel implements ITemporaryItemModel {
    boughtCheckbox?: boolean
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
            id: a.uuid,
            groupId: a.groupUuid,
            name: a.name,
            shoppingListId: a.shoppingListUuid,
            category: subcategories.filter(i => i.id === a.categoryUuid)[0],
            quantity: a.quantity,
            bought: a.bought,
            boughtCheckbox: a.bought?true:false,
            createTime: a.createTime,
            updateTime: a.updateTime,
            deleteTime: a.deleteTime,
        });
      }

      static toJson(entity: TemporaryItemModel): string{
        var tmp: any = {};
        tmp.uuid = entity.id;
        tmp.groupUuid = entity.groupId;
        tmp.createTime = entity.createTime;
        tmp.updateTime = entity.updateTime;
        tmp.deleteTime = entity.deleteTime;
        tmp.name = entity.name;
        tmp.quantity = entity.quantity;
        tmp.shoppingListUuid = entity.shoppingListId;
        tmp.categoryUuid = entity.category.id;
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
    CATEGORY = 'categoryUuid',
    SUBCATEGORY = 'subcategoryUuid',
}

export class TemporaryItemsFilters {
    constructor(
        public categoryUuid = '',
        public subcategoryUuid = '',
        public pageNumber = 1,
        public pageSize = 50,
        public orderBy = "categoryUuid asc, name asc") {
    }
}