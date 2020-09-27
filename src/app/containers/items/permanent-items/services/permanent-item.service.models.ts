import { SubCategory, IItemModel, IModel } from "../../models/models";

export class State implements IModel {
    id: string;
    name: string;
    createTime: string;
    updateTime: string;
    deleteTime: string;
}


export enum PermanentItemTypes {
  NAME = 'name',
  CATEGORY = 'category',
  SUBCATEGORY = 'subcategory',
  STATE = 'state',
  ID = 'id',
  DATE = "date"
}

export interface IPermanentItemModel extends IItemModel {
    state: State;
}

export class PermanentItemModel implements IPermanentItemModel{
    state: State;
    id: string;
    name: string;
    category: SubCategory;
    createTime: string;
    updateTime: string;
    deleteTime: string;

    public constructor(init?:Partial<PermanentItemModel>) {
        Object.assign(this, init);
    }

    static createFromJson(a: any, states:State[], subcategories:SubCategory[]): PermanentItemModel {
        return new PermanentItemModel ({
            id: a.id,
            name: a.name,
            category: subcategories.filter(i => i.id === a.categoryId)[0],
            state: states.filter(i=>i.id === a.stateId)[0],
            createTime: a.createTime,
            updateTime: a.updateTime,
            deleteTime: a.deleteTime,
        });
      }
}

export type PermanentItemMethods = 'add' | 'remove' | 'update' | 'more' | 'state';

export interface PermanentItemAction {
    type: PermanentItemMethods 
    data: PermanentItemModel
}

export enum PermanentItemsFilterTypes {
    CATEGORY = 'categoryId',
    SUBCATEGORY = 'subcategoryId',
    STATE = 'stateId'
}

export class PermanentItemsFilters {
    constructor(
        public categoryId = '',
        public subcategoryId = '',
        public stateId = '',
        public pageNumber = 1,
        public pageSize = 15) {
    }
}