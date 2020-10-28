import { Action, Filter, Methods } from 'src/app/containers/models/models';
import { ICategory } from '../../models/models';

export class Category implements ICategory {
    id: string;
    name: string;
    groupId: string;
    createTime: string;
    updateTime: string;
    deleteTime: string;

    public constructor(init?: Partial<Category>) {
        Object.assign(this, init);
    }

    static createFromJson(a: any): Category {
        return new Category({
            id: a.uuid,
            name: a.name,
            groupId : a.groupUuid,
            createTime: a.createTime,
            updateTime: a.updateTime,
            deleteTime: a.deleteTime
        });
    }

    static toJson(entity: Category): string{
        var tmp: any = {};
        tmp.uuid = entity.id;
        tmp.groupUuid = entity.groupId;
        tmp.createTime = entity.createTime;
        tmp.updateTime = entity.updateTime;
        tmp.deleteTime = entity.deleteTime;
        tmp.name = entity.name;
        return JSON.stringify(tmp)
    }
}

export enum CategoryTypes {
    NAME = 'name',
    ID = 'id'
}

export interface CategoryAction extends Action {
    data: Category
}

export enum CartegoriesFilterTypes {
}

export class CategoriesFilters implements Filter {
    constructor(
        public pageNumber = 1,
        public pageSize = 25,
        public orderBy = "uuid asc") {
    }
}