import { Action, Filter, IModel, Methods } from 'src/app/containers/models/models';

export interface IGroup extends IModel {
    id: string;
    name: string;
}

export class Group implements IGroup {
    id: string;
    name: string;
    createTime: string;
    updateTime: string;
    deleteTime: string;

    public constructor(init?: Partial<Group>) {
        Object.assign(this, init);
    }

    static createFromJson(a: any): Group {
        return new Group({
            id: a.uuid,
            name: a.name,
            createTime: a.createTime,
            updateTime: a.updateTime,
            deleteTime: a.deleteTime
        });
    }

    static toJson(entity: Group): string{
        var tmp: any = {};
        tmp.uuid = entity.id;
        tmp.createTime = entity.createTime;
        tmp.updateTime = entity.updateTime;
        tmp.deleteTime = entity.deleteTime;
        tmp.name = entity.name;
        return JSON.stringify(tmp)
    }
}

export enum GroupTypes {
    NAME = 'username',
    EMAIL = 'email',
    ID = 'id'
}

export interface GroupAction extends Action {
    data: Group
}

export enum GroupsFilterTypes {
}

export class GroupsFilters implements Filter {
    constructor(
        public pageNumber = 1,
        public pageSize = 25,
        public orderBy = "username desc") {
    }
}