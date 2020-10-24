import { IModel } from 'src/app/containers/models/models';
import { State } from 'src/app/containers/settings/states/services/states.service.models';
import { SubCategory } from 'src/app/containers/settings/subcategories/services/subcategories.service.models';
import { IItemModel } from "../../models/models";

export enum PermanentItemTypes {
    NAME = 'name',
    CATEGORY = 'category',
    SUBCATEGORY = 'subcategory',
    STATE = 'update',
    ID = 'id',
    DATE = "date",
    ARCHIVE = "remove"
}

export interface IPermanentItemModel extends IItemModel {
    state: State;
    counter: number;
}

export class PermanentItemModel implements IPermanentItemModel {
    state: State;
    counter: number = 0;
    id: string;
    groupId: string;
    name: string;
    category: SubCategory;
    createTime: string;
    updateTime: string;
    deleteTime: string;

    public constructor(init?: Partial<PermanentItemModel>) {
        Object.assign(this, init);
    }

    static createFromJson(a: any, states: State[], subcategories: SubCategory[]): PermanentItemModel {
        return new PermanentItemModel({
            id: a.id,
            groupId: a.groupId,
            name: a.name,
            counter: a.counter,
            category: subcategories.filter(i => i.id === a.categoryId)[0],
            state: states.filter(i => i.id === a.stateId)[0],
            createTime: a.createTime,
            updateTime: a.updateTime,
            deleteTime: a.deleteTime,
        });
    }

    static toJson(entity: PermanentItemModel) : string {
        var tmp: any = {};
        tmp.id = entity.id;
        tmp.groupId = entity.groupId;
        tmp.counter = entity.counter;
        tmp.createTime = entity.createTime;
        tmp.updateTime = entity.updateTime;
        tmp.deleteTime = entity.deleteTime;
        tmp.name = entity.name;
        tmp.categoryId = entity.category.id;
        tmp.stateId = entity.state.id;
        return JSON.stringify(tmp)
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
        public pageSize = 25,
        public orderBy = "counter desc, categoryId asc, stateId asc, name asc") {
    }
}