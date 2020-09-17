export interface IModel {
    archived: boolean;
    createTime: string;
    updateTime: string;
    deleteTime: string;
}

export interface IItemModel extends IModel{
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
    archived: boolean;
    createTime: string;
    updateTime: string;
    deleteTime: string;

    public constructor(init?:Partial<SubCategory>) {
        Object.assign(this, init);
    }
}

export class Category implements ICategory {
    id: string;
    name: string;
    archived: boolean;
    createTime: string;
    updateTime: string;
    deleteTime: string;

    public constructor(init?:Partial<Category>) {
        Object.assign(this, init);
    }
}