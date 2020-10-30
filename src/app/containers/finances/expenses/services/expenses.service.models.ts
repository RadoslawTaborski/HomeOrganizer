import { Action, Filter, IModel, Methods } from 'src/app/containers/models/models';

export interface IExpense extends IModel{
    id: string;
    name: string;
    groupId: string;
}

export class Expense implements IExpense {
    id: string;
    name: string;
    groupId: string;
    createTime: string;
    updateTime: string;
    deleteTime: string;

    public constructor(init?: Partial<Expense>) {
        Object.assign(this, init);
    }

    static createFromJson(a: any): Expense {
        return new Expense({
            id: a.uuid,
            name: a.name,
            groupId : a.groupUuid,
            createTime: a.createTime,
            updateTime: a.updateTime,
            deleteTime: a.deleteTime
        });
    }

    static toJson(entity: Expense): string{
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




export enum ExpenseTypes {
  NAME = 'name',
  ID = 'id',
  VALUE = 'value',
  RECIPIENTS = "recipients",
  PAYER = "payer",
  AMOUNT = "amount"
}

export interface ExpenseAction extends Action {
    data: Expense
}

export enum ExpensesFilterTypes {
}

export class ExpensesFilters implements Filter {
    constructor(
        public pageNumber = 1,
        public pageSize = 25,
        public orderBy = "createTime desc") {
    }
}