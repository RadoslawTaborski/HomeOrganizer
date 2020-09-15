export interface AddItemModel {
    key: string;
    display: string;
    type: string;
}

export interface AddItemInputModel extends AddItemModel {
    textProvider?: Function;
}

export interface AddItemSelectModel extends AddItemModel {
    value?: string;
    options?: any[];
    displayProvider?: Function;
    identifierProvider?: Function;
}

export class FieldTypes {
    static INPUT = 'input';
    static INPUT_NUMBER = 'input_number';
    static SELECT = 'select';
}

export class AddItemInput implements AddItemInputModel {
    constructor(
        public key,
        public display,
        public textProvider?,
        public type = FieldTypes.INPUT,
    ) {
    }
}

export class AddItemSelect implements AddItemSelectModel {
    constructor(
        public key,
        public display,
        public value?,
        public options?,
        public displayProvider?,
        public identifierProvider?,
        public type = FieldTypes.SELECT
    ) {
    }
}

export class AddItemConfig {
    constructor(public data: AddItemModel[]) {
    }

    add(item: AddItemModel) {
        this.data.push(item);
    }
}