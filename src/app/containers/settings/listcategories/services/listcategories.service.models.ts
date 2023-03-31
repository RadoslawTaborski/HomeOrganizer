import { Action, Methods } from 'src/app/containers/models/models';
import { ICategory } from '../../models/models';

export class ListCategory implements ICategory {
  id: string;
  groupId: string;
  name: string;
  createTime: string;
  updateTime: string;
  deleteTime: string;

  public constructor(init?: Partial<ListCategory>) {
    Object.assign(this, init);
  }

  static createFromJson(a: any): ListCategory {
    return new ListCategory({
      id: a.uuid,
      groupId: a.groupUuid,
      name: a.name,
      createTime: a.createTime,
      updateTime: a.updateTime,
      deleteTime: a.deleteTime
    });
  }

  static toJson(entity: ListCategory): string {
    var tmp: any = {};
    tmp.uuid = entity.id;
    tmp.groupUuid = entity.groupId;
    tmp.createTime = entity.createTime;
    tmp.updateTime = entity.updateTime;
    tmp.deleteTime = entity.deleteTime;
    tmp.name = entity.name;
    return JSON.stringify(tmp)
  }
}

export enum ListcategoryTypes {
  NAME = 'name',
  ID = 'id',
}

export interface ListcategoryAction extends Action {
  type: Methods
  data: ListCategory
}

export enum ListcartegoriesFilterTypes {
}

export class ListcategoriesFilters {
  constructor(
    public pageNumber = 1,
    public pageSize = 25,
    public orderBy = "uuid asc") {
  }
}