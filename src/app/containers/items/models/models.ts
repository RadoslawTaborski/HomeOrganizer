export interface IItemModel {
    id: string;
    name: string;
    category: SubCategory;
}

export interface ICategory {
    id: string;
    name: string;
}

export class SubCategory implements ICategory {
    id: string;
    name: string;
    parent: Category;

    public constructor(init?:Partial<SubCategory>) {
        Object.assign(this, init);
    }
}

export class Category implements ICategory {
    id: string;
    name: string;

    public constructor(init?:Partial<Category>) {
        Object.assign(this, init);
    }
}