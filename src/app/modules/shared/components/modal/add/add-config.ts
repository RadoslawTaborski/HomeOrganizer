export interface AddItemModel {
    key: string;
    display: string;
    type: string;
}

export abstract class AddItemModelBase implements AddItemModel{
    key: string;
    display: string;
    type: string;

    static Builder = class {
        key: string;
        display: string;

        public setKey(key: string): this {
            this.key = key;
            return this;
        }

        public setDisplay(display: string): this{
            this.display = display;
            return this;
        }

        protected internalSetter(instance: AddItemModelBase, type: string) {
            instance.key = this.key;
            instance.display = this.display;
            instance.type = type;
        }
    }
}

export interface AddItemInputModel extends AddItemModel {
    readonly textProvider?: Function;
}

export interface AddItemSelectModel extends AddItemModel {
    readonly value?: string;
    readonly options?: any[];
    readonly displayProvider?: Function;
    readonly identifierProvider?: Function;
}

export class AddItemInput extends AddItemModelBase implements AddItemInputModel {
    textProvider?: Function;

    static Builder = class extends AddItemModelBase.Builder {
        textProvider?: Function;

        public setTextProvider(textProvider: Function) : this{
            this.textProvider = textProvider;
            return this;
        }

        public build(): AddItemInput {
            let entity = new AddItemInput();
            super.internalSetter(entity, FieldTypes.INPUT);
            entity.textProvider = this.textProvider;

            return entity;
        }
    }
}

export class AddItemSelect extends AddItemModelBase implements AddItemSelectModel { 
    value?: string;
    options?: any[];
    displayProvider?: Function;
    identifierProvider?: Function;

    static Builder = class extends AddItemModelBase.Builder {
        value?: string;
        options?: any[];
        displayProvider?: Function;
        identifierProvider?: Function;

        public setValue(value: string) : this{
            this.value = value;
            return this;
        }

        public setOptions(value: any[]) : this{
            this.options = value;
            return this;
        }

        public setDisplayProvider(value: Function) : this{
            this.displayProvider = value;
            return this;
        }

        public setIdentifierProvider(value: Function) : this{
            this.identifierProvider = value;
            return this;
        }

        public build(): AddItemSelect {
            let entity = new AddItemSelect();
            super.internalSetter(entity, FieldTypes.SELECT);
            entity.value = this.value;
            entity.options = this.options;
            entity.displayProvider = this.displayProvider;
            entity.identifierProvider = this.identifierProvider;

            return entity;
        }
    }
}

export class FieldTypes {
    static INPUT = 'input';
    static INPUT_NUMBER = 'input_number';
    static SELECT = 'select';
}

export class AddItemConfig {
    constructor(public data: AddItemModel[]) {
    }

    add(item: AddItemModel) {
        this.data.push(item);
    }
}