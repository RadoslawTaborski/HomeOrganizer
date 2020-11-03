import { User } from 'src/app/containers/accounts/users/services/users.service.models';
import { Action, Filter, IModel, Methods } from 'src/app/containers/models/models';
import { ExpenseSettings } from '../../expenses-settings/services/expenses-settings.service.models';

export interface IExpenseDetail extends IModel {
    id: string;
    expenseId: string;
    value: number;
    payer: User;
    recipient: ExpenseSettings;
}

export class ExpenseDetail implements IExpenseDetail {
    id: string;
    expenseId: string;
    value: number;
    payer: User;
    recipient: ExpenseSettings;
    createTime: string;
    updateTime: string;
    deleteTime: string;

    public constructor(init?: Partial<ExpenseDetail>) {
        Object.assign(this, init);
    }

    static createFromJson(a: any, payer: User, recipient:ExpenseSettings): ExpenseDetail {
        return new ExpenseDetail({
            id: a.uuid,
            expenseId: a.expenseUuid,
            value: a.value,
            payer: payer,
            recipient: recipient,
            createTime: a.createTime,
            updateTime: a.updateTime,
            deleteTime: a.deleteTime
        });
    }

    static toJson(entity: ExpenseDetail, expenseId: string): string{
        var tmp: any = {};
        tmp.uuid = entity.id;
        tmp.expenseUuid = expenseId;
        tmp.value = entity.value;
        tmp.payerUuid = entity.payer.id;
        tmp.recipientUuid = entity.recipient.user.id;
        tmp.createTime = entity.createTime;
        tmp.updateTime = entity.updateTime;
        tmp.deleteTime = entity.deleteTime;
        return JSON.stringify(tmp)
    }
}

export enum ExpenseDetailTypes {
    ID = 'id',
    PAYER = 'payerId',
    RECIPIENT = 'recipientId',
    VALUE = 'value'
}

export interface ExpenseDetailAction extends Action {
    data: ExpenseDetail
}

export enum ExpenseDetailFilterTypes {
}

export class ExpenseDetailFilters implements Filter {
    constructor(
        public pageNumber = 1,
        public pageSize = 25,
        public expenseUuid = '',
        public groupUuid = '',
        public orderBy = "createTime desc") {
    }
}