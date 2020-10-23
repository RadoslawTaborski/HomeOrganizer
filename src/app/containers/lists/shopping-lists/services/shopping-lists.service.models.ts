import { ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { IModel, SubCategory } from 'src/app/containers/items/models/models';
import { ITemporaryItemModel, TemporaryItemModel } from 'src/app/containers/items/temporary-items/services/temporary-item.service.models';




export enum ShoppingListsTypes {
  NAME = 'name',
  CREATED = 'created',
  UPDATED = 'updated',
  ID = 'id',
  MORE = 'more',
  ARCHIVE = 'remove',
  DESCRIPTION = "description",
  VISIBLE = "visible"
}

export interface IShoppingListModel extends IModel {
    id: string;
    groupId: string;
    name: string;
    description: string;
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
    visible: boolean;
    data: ITemporaryItemModel[];
    createTime: string;
    updateTime: string;
    deleteTime: string;

    public constructor(init?: Partial<ShoppingListModel>) {
        Object.assign(this, init);
    }

    static createFromJson(a: any, data: ITemporaryItemModel[]): ShoppingListModel {
        return new ShoppingListModel({
            id: a.id,
            groupId: a.groupId,
            name: a.name,
            description: a.description,
            visible: a.visible,
            data: data,
            createTime: a.createTime,
            updateTime: a.updateTime,
            deleteTime: a.deleteTime,
        });
    }

    static toJson(entity: ShoppingListModel): string{
        var tmp: any = {};
        tmp.id = entity.id;
        tmp.groupId = entity.groupId;
        tmp.createTime = entity.createTime;
        tmp.updateTime = entity.updateTime;
        tmp.deleteTime = entity.deleteTime;
        tmp.name = entity.name;
        tmp.description = entity.description;
        tmp.visible = entity.visible
        
        return JSON.stringify(tmp)
    }
}

export type ShoppingListsMethods = 'add' | 'remove' | 'update' | 'more';

export interface ShoppingListAction {
    type: ShoppingListsMethods
    data: ShoppingListModel
}

export class ShoppingListsFilters {
    constructor(
        public pageNumber = 1,
        public pageSize = 25,
        public orderBy = "updateTime desc, createTime desc") {
    }
}

export interface ShoppingListResolver<T> {
    resolve(route: ActivatedRouteSnapshot): Promise<T>
}
