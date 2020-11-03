import { Action, Filter, IModel, Methods } from 'src/app/containers/models/models';

export interface IUser extends IModel {
    id: string;
    username: string;
    email: string;
    groupId: string;
}

export class User implements IUser {
    id: string;
    username: string;
    email: string;
    groupId: string;
    createTime: string;
    updateTime: string;
    deleteTime: string;

    public constructor(init?: Partial<User>) {
        Object.assign(this, init);
    }

    static createFromJson(a: any): User {
        return new User({
            id: a.uuid,
            username: a.username,
            email: a.email,
            groupId : a.groupUuid,
            createTime: a.createTime,
            updateTime: a.updateTime,
            deleteTime: a.deleteTime
        });
    }

    static toJson(entity: User): string{
        var tmp: any = {};
        tmp.uuid = entity.id;
        tmp.groupUuid = entity.groupId;
        tmp.createTime = entity.createTime;
        tmp.updateTime = entity.updateTime;
        tmp.deleteTime = entity.deleteTime;
        tmp.username = entity.username;
        tmp.email = entity.email;
        return JSON.stringify(tmp)
    }
}

export enum UserTypes {
    NAME = 'username',
    EMAIL = 'email',
    ID = 'id'
}

export interface UserAction extends Action {
    data: User
}

export enum UsersFilterTypes {
}

export class UsersFilters implements Filter {
    constructor(
        public pageNumber = 1,
        public pageSize = 25,
        
        public orderBy = "username desc") {
    }
}