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
            id: a.id,
            name: a.name,
            groupId : a.groupId,
            createTime: a.createTime,
            updateTime: a.updateTime,
            deleteTime: a.deleteTime
        });
    }

    static toJson(entity: Category): string{
        var tmp: any = {};
        tmp.id = entity.id;
        tmp.groupId = entity.groupId;
        tmp.createTime = entity.createTime;
        tmp.updateTime = entity.updateTime;
        tmp.deleteTime = entity.deleteTime;
        tmp.name = entity.name;
        return JSON.stringify(tmp)
    }
}