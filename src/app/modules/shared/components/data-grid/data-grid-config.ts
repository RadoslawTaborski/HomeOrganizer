export interface DataGridItemModel {
    key: string;
    display: string;
    type: string;
    alwaysVisible: boolean;
    width?: string;
}

export interface DataGridItemTextModel extends DataGridItemModel {
    textProvider?: Function;
}

export interface DataGridItemCheckboxModel extends DataGridItemModel {
    textProvider?: Function;
    valueProvider?: Function;
}

export interface DataGridItemButtonModel extends DataGridItemModel {
    displayProvider: Function
    access: string;
    styleProvider?: Function
}

export interface DataGridItemInputModel extends DataGridItemModel {
    access: string;
}

export interface DataGridItemImageModel extends DataGridItemModel {
    src: string;
}

export class FieldTypes {
    static INPUT = 'input';
    static IMAGE = 'img';
    static BUTTON = 'button';
    static CHECKBOX = 'checkbox';
}

export class DataGridItemText implements DataGridItemTextModel {
    constructor(
        public key,
        public display,
        public textProvider?,
        public width?,
        public alwaysVisible = false,
        public type = null) { }
}

export class DataGridItemCheckbox implements DataGridItemCheckboxModel {
    constructor(
        public key,
        public display,
        public textProvider?,
        public valueProvider?,
        public width?,
        public alwaysVisible = false,
        public type = FieldTypes.CHECKBOX) { }
}

export class DataGridItemButton implements DataGridItemButtonModel {
    constructor(
        public key,
        public display,
        public displayProvider,
        public access,
        public styleProvider?,
        public width?,
        public alwaysVisible = false,
        public type = FieldTypes.BUTTON) { }
}

export class DataGridItemInput implements DataGridItemInputModel {
    constructor(
        public key,
        public display,
        public access,
        public width?,
        public alwaysVisible = false,
        public type = FieldTypes.INPUT) { }
}

export class DataGridItemImage implements DataGridItemImageModel {
    constructor(
        public key,
        public display,
        public src,
        public width?,
        public alwaysVisible = false,
        public type = FieldTypes.IMAGE) { }
}

export class DataGridConfig {
    constructor(public data: DataGridItemModel[]) {
    }

    add(item: DataGridItemModel) {
        this.data.push(item);
    }
}
