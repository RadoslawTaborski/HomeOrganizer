import { ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { ITemporaryItemModel, TemporaryItemModel } from 'src/app/containers/items/temporary-items/services/temporary-item.service.models';
import { IModel } from 'src/app/containers/models/models';
import { ListCategory } from 'src/app/containers/settings/listcategories/services/listcategories.service.models';

export enum ShoppingListsTypes {
  NAME = 'name',
  CREATED = 'created',
  UPDATED = 'updated',
  ID = 'id',
  MORE = 'more',
  ARCHIVE = 'remove',
  DESCRIPTION = "description",
  CATEGORY = 'category',
  VISIBLE = "visible"
}

export interface IShoppingListModel extends IModel {
    id: string;
    groupId: string;
    name: string;
    description: string;
    category: ListCategory;
    visible: boolean;
    data: ITemporaryItemModel[];
    createTime: string;
    updateTime: string;
    deleteTime: string;
}

export class ShoppingListModel implements IShoppingListModel {
    id: string;
    name: string;
    groupId: string;
    description: string;
    category: ListCategory;
    visible: boolean;
    data: ITemporaryItemModel[];
    createTime: string;
    updateTime: string;
    deleteTime: string;

    public constructor(init?: Partial<ShoppingListModel>) {
        Object.assign(this, init);
    }

    static createFromJson(a: any, data: ITemporaryItemModel[], categories: ListCategory[]): ShoppingListModel {
        return new ShoppingListModel({
            id: a.uuid,
            groupId: a.groupUuid,
            name: a.name,
            description: a.description,
            category: categories.filter(i=>i.id === a.categoryUuid)[0],
            visible: a.visible,
            data: data,
            createTime: a.createTime,
            updateTime: a.updateTime,
            deleteTime: a.deleteTime,
        });
    }

    static createSimpleFromJson(a: any, categories: ListCategory[]): ShoppingListModel {
        return new ShoppingListModel({
            id: a.uuid,
            groupId: a.groupUuid,
            name: a.name,
            description: a.description,
            category: categories.filter(i=>i.id === a.categoryUuid)[0],
            visible: a.visible,
            data: null,
            createTime: a.createTime,
            updateTime: a.updateTime,
            deleteTime: a.deleteTime,
        });
    }

    static toJson(entity: ShoppingListModel): string{
        var tmp: any = {};
        tmp.uuid = entity.id;
        tmp.groupUuid = entity.groupId;
        tmp.createTime = entity.createTime;
        tmp.updateTime = entity.updateTime;
        tmp.deleteTime = entity.deleteTime;
        tmp.name = entity.name;
        tmp.description = entity.description;
        tmp.categoryUuid = entity.category.id;
        tmp.visible = entity.visible
        
        return JSON.stringify(tmp)
    }
}

export type ShoppingListsMethods = 'add' | 'remove' | 'update' | 'more';

export interface ShoppingListAction {
    type: ShoppingListsMethods
    data: ShoppingListModel
}

export enum ShoppingListsFilterTypes {
    CATEGORY = 'categoryUuid'
}

export class ShoppingListsFilters {
    constructor(
        public pageNumber = 1,
        public pageSize = 30,
        public categoryUuid = '',
        public orderBy = "visible desc, updateTime desc, createTime desc") {
    }
}

export interface ShoppingListResolver<T> {
    resolve(route: ActivatedRouteSnapshot): Promise<T>
}
