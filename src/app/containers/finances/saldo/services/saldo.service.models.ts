import { User } from 'src/app/containers/accounts/users/services/users.service.models';
import { Action, Filter, IModel } from 'src/app/containers/models/models';
import { Expense } from '../../expenses/services/expenses.service.models';

export interface ISaldo extends IModel {
    groupId: string;
    payer: User;
    recipient: User;
    value: number;
}

export class Saldo implements ISaldo {
    groupId: string;
    payer: User;
    recipient: User;
    value: number;
    createTime: string;
    updateTime: string;
    deleteTime: string;

    public constructor(init?: Partial<Saldo>) {
        Object.assign(this, init);
    }

    static createFromJson(a: any, payer: User, recipient: User): Saldo {
        return new Saldo({
            groupId: a.groupUuid,
            payer: payer,
            recipient: recipient,
            value: a.value
        });
    }
}

export enum SaldoTypes {
    PAYER = 'payerId',
    RECIPIENT = 'recipientId',
    VALUE = 'value'
}

export interface SaldoAction extends Action {
    data: Expense
}

export enum SaldoFilterTypes {
}

export class SaldoFilters implements Filter {
    constructor(
        public pageNumber = 1,
        public pageSize = 25,
        public groupUuid = '',
        public orderBy = "payerUuid asc") {
    }
}