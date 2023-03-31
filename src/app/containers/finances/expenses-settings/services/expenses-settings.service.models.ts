import { Group } from 'src/app/containers/accounts/groups/services/groups.service.models';
import { User } from 'src/app/containers/accounts/users/services/users.service.models';
import { Action, Filter, IModel, Methods } from 'src/app/containers/models/models';

export interface IExpenseSettings extends IModel {
  id: string;
  user: User;
  groupId: string;
  value: number;
}

export class ExpenseSettings implements IExpenseSettings {
  id: string;
  user: User;
  groupId: string;
  value: number;
  createTime: string;
  updateTime: string;
  deleteTime: string;

  public constructor(init?: Partial<ExpenseSettings>) {
    Object.assign(this, init);
  }

  static createFromJson(a: any, user: User): ExpenseSettings {
    return new ExpenseSettings({
      id: a.uuid,
      user: user,
      groupId: a.groupUuid,
      value: a.value,
      createTime: a.createTime,
      updateTime: a.updateTime,
      deleteTime: a.deleteTime
    });
  }

  static toJson(entity: ExpenseSettings): string {
    var tmp: any = {};
    tmp.uuid = entity.id;
    tmp.createTime = entity.createTime;
    tmp.updateTime = entity.updateTime;
    tmp.deleteTime = entity.deleteTime;
    tmp.groupUuid = entity.groupId;
    tmp.userUuid = entity.user.id;
    tmp.value = entity.value;
    return JSON.stringify(tmp)
  }
}

export enum ExpenseSettingsTypes {
  USER = 'user',
  VALUE = 'value',
  ID = 'id'
}

export interface ExpenseSettingsAction extends Action {
  data: ExpenseSettings
}

export enum ExpenseSettingsFilterTypes {
}

export class ExpenseSettingsFilters implements Filter {
  constructor(
    public pageNumber = 1,
    public pageSize = 25,
    public userUuid = "",
    public groupUuid = "",
    public orderBy = "") {
  }
}