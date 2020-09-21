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
}