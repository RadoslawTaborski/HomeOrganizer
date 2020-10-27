import { Action, Methods } from 'src/app/containers/models/models';
import { Category } from '../../categories/services/categories.service.models';
import { ICategory } from '../../models/models';

export class SubCategory implements ICategory {
    id: string;
    groupId: string;
    name: string;
    parent: Category;
    createTime: string;
    updateTime: string;
    deleteTime: string;

    public constructor(init?: Partial<SubCategory>) {
        Object.assign(this, init);
    }

    static createFromJson(a: any, categories: Category[]): SubCategory {
        return new SubCategory({
            id: a.id,
            groupId: a.groupId,
            name: a.name,
            parent: categories.filter(i => i.id === a.categoryId)[0],
            createTime: a.createTime,
            updateTime: a.updateTime,
            deleteTime: a.deleteTime
        });
    }

    static toJson(entity: SubCategory): string{
        var tmp: any = {};
        tmp.id = entity.id;
        tmp.groupId = entity.groupId;
        tmp.createTime = entity.createTime;
        tmp.updateTime = entity.updateTime;
        tmp.deleteTime = entity.deleteTime;
        tmp.name = entity.name;
        tmp.categoryId = entity.parent.id;
        return JSON.stringify(tmp)
    }
}

export enum SubcategoryTypes {
    NAME = 'name',
    ID = 'id',
    PARENT = 'parent'
}

export interface SubcategoryAction extends Action {
    type: Methods
    data: SubCategory
}

export enum SubcartegoriesFilterTypes {
    CATEGORY = 'categoryId',
}

export class SubcategoriesFilters {
    constructor(
        public categoryId = '',
        public pageNumber = 1,
        public pageSize = 25,
        public orderBy = "categoryId asc, id asc") {
    }
}