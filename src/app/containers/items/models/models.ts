export interface IModel {
    createTime: string;
    updateTime: string;
    deleteTime: string;
}

export interface IItemModel extends IModel {
    id: string;
    name: string;
    category: SubCategory;
}

export interface ICategory extends IModel {
    id: string;
    name: string;
}

export class SubCategory implements ICategory {
    id: string;
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
            name: a.name,
            parent: categories.filter(i => i.id === a.categoryId)[0],
            createTime: a.createTime,
            updateTime: a.updateTime,
            deleteTime: a.deleteTime
        });
    }

    static toJson(entity: SubCategory): string{
        var tmp: any = {};
        tmp.id = parseInt(entity.id);
        tmp.createTime = entity.createTime;
        tmp.updateTime = entity.updateTime;
        tmp.deleteTime = entity.deleteTime;
        tmp.name = entity.name;
        tmp.categoryId = parseInt(entity.parent.id);
        return JSON.stringify(tmp)
    }
}

export class Category implements ICategory {
    id: string;
    name: string;
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
            createTime: a.createTime,
            updateTime: a.updateTime,
            deleteTime: a.deleteTime
        });
    }

    static toJson(entity: Category): string{
        var tmp: any = {};
        tmp.id = parseInt(entity.id);
        tmp.createTime = entity.createTime;
        tmp.updateTime = entity.updateTime;
        tmp.deleteTime = entity.deleteTime;
        tmp.name = entity.name;
        return JSON.stringify(tmp)
    }
}

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
        tmp.id = parseInt(entity.id);
        tmp.createTime = entity.createTime;
        tmp.updateTime = entity.updateTime;
        tmp.deleteTime = entity.deleteTime;
        tmp.name = entity.name;
        return JSON.stringify(tmp)
    }
}