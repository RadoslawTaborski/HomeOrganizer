import { Action, IModel, Methods } from 'src/app/containers/models/models';

export interface IState extends IModel {
    id: string;
    name: string;
}

export class State implements IState {
    id: string;
    name: string;
    createTime: string;
    updateTime: string;
    deleteTime: string;

    public constructor(init?: Partial<State>) {
        Object.assign(this, init);
    }

    static createFromJson(a: any): State {
        return new State({
            id: a.id,
            name: a.name,
            createTime: a.createTime,
            updateTime: a.updateTime,
            deleteTime: a.deleteTime
        });
    }

    static toJson(entity: State): string{
        var tmp: any = {};
        tmp.id = entity.id;
        tmp.createTime = entity.createTime;
        tmp.updateTime = entity.updateTime;
        tmp.deleteTime = entity.deleteTime;
        tmp.name = entity.name;
        return JSON.stringify(tmp)
    }
}

export enum StateTypes {
    NAME = 'name',
    ID = 'id',
}

export interface StateAction extends Action {
    type: Methods
    data: State
}

export enum SteteFilterTypes {
}

export class StateFilters {
    constructor(
        public pageNumber = 1,
        public pageSize = 25,
        public orderBy = "categoryId asc, id asc") {
    }
}