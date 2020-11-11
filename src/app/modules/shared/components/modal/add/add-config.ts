export interface AddItemModel {
    key: string;
    display: string;
    type: string;
    enabled: boolean
}

export abstract class AddItemModelBase implements AddItemModel{
    key: string;
    display: string;
    type: string;
    enabled: boolean

    static Builder = class {
        key: string;
        display: string;
        enabled: boolean = true

        public setKey(key: string): this {
            this.key = key;
            return this;
        }

        public setDisplay(display: string): this{
            this.display = display;
            return this;
        }

        public setEnabled(value: boolean): this{
            this.enabled = value;
            return this;
        }

        protected internalSetter(instance: AddItemModelBase, type: string) {
            instance.key = this.key;
            instance.display = this.display;
            instance.type = type;
            instance.enabled = this.enabled;
        }
    }
}

export interface AddItemInputModel extends AddItemModel {
    readonly textProvider?: Function;
    readonly defaultValue: string;
}

export interface AddItemNumberModel extends AddItemModel {
    readonly textProvider?: Function;
    readonly step?: number;
    readonly default?: number;
}

export interface AddItemSelectModel extends AddItemModel {
    readonly value?: string;
    readonly options?: any[];
    readonly displayProvider?: Function;
    readonly identifierProvider?: Function;
}

export interface AddItemCheckboxesModel extends AddItemModel {
    readonly options?: CheckboxPair[];
    readonly displayProvider?: Function;
    readonly identifierProvider?: Function;
}

export interface AddItemCheckboxModel extends AddItemModel {
    readonly value?: boolean;
    readonly displayProvider?: Function;
}

export interface AddItemRadioModel extends AddItemModel {
    readonly options?: CheckboxPair[];
    readonly displayProvider?: Function;
    readonly identifierProvider?: Function;
}

export class CheckboxPair {
    private object: any
    value: boolean

    constructor(object: any, value: boolean){
        this.object = object,
        this.value = value
    }

    getObject(): any {
        return this.object;
    }
}

export class AddItemInput extends AddItemModelBase implements AddItemInputModel {
    defaultValue: string;
    textProvider?: Function;

    static Builder = class extends AddItemModelBase.Builder {
        textProvider?: Function;
        defaultValue: string;

        public setTextProvider(textProvider: Function) : this{
            this.textProvider = textProvider;
            return this;
        }

        public setDefaultValue(value: string) : this {
            this.defaultValue = value;
            return this;
        }

        public build(): AddItemInput {
            let entity = new AddItemInput();
            super.internalSetter(entity, FieldTypes.INPUT);
            entity.textProvider = this.textProvider;
            entity.defaultValue = this.defaultValue;

            return entity;
        }
    }
}

export class AddItemNumber extends AddItemModelBase implements AddItemNumberModel {
    textProvider?: Function;
    step?: number;
    default?: number;

    static Builder = class extends AddItemModelBase.Builder {
        textProvider?: Function;
        step?: number;
        default?: number;

        public setTextProvider(textProvider: Function) : this{
            this.textProvider = textProvider;
            return this;
        }

        public setStep(step: number): this{
            this.step = step;
            return this;
        }

        public setDefault(value: number): this{
            this.default = value;
            return this;
        }

        public build(): AddItemNumber {
            let entity = new AddItemNumber();
            super.internalSetter(entity, FieldTypes.INPUT_NUMBER);
            entity.textProvider = this.textProvider;
            entity.step = this.step;
            entity.default=this.default;

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

export class AddItemCheckboxes extends AddItemModelBase implements AddItemCheckboxesModel { 
    options?: CheckboxPair[];
    displayProvider?: Function;
    identifierProvider?: Function;

    static Builder = class extends AddItemModelBase.Builder {
        options?: CheckboxPair[];
        displayProvider?: Function;
        identifierProvider?: Function;

        public setOptions(value: CheckboxPair[]) : this{
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

        public build(): AddItemCheckboxes {
            let entity = new AddItemCheckboxes();
            super.internalSetter(entity, FieldTypes.CHECKBOXES);
            entity.options = this.options;
            entity.displayProvider = this.displayProvider;
            entity.identifierProvider = this.identifierProvider;

            return entity;
        }
    }
}

export class AddItemCheckbox extends AddItemModelBase implements AddItemCheckboxModel { 
    value?: boolean;
    displayProvider?: Function;

    static Builder = class extends AddItemModelBase.Builder {
        value?: boolean;
        displayProvider?: Function;

        public setValue(value: boolean) : this{
            this.value = value;
            return this;
        }

        public setDisplayProvider(value: Function) : this{
            this.displayProvider = value;
            return this;
        }

        public build(): AddItemCheckbox {
            let entity = new AddItemCheckbox();
            super.internalSetter(entity, FieldTypes.CHECKBOX);
            entity.value = this.value;
            entity.displayProvider = this.displayProvider;

            return entity;
        }
    }
}

export class AddItemRadio extends AddItemModelBase implements AddItemRadioModel { 
    options?: CheckboxPair[];
    displayProvider?: Function;
    identifierProvider?: Function;

    static Builder = class extends AddItemModelBase.Builder {
        value?: any;
        options?: any[];
        displayProvider?: Function;
        identifierProvider?: Function;

        public setValue(value: any) : this{
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

        public build(): AddItemRadio {
            let entity = new AddItemRadio();
            super.internalSetter(entity, FieldTypes.RADIO);
            entity.options = []
            for(let item of this.options){
                if(item==this.value){
                    entity.options.push(new CheckboxPair(item, true))
                } else {
                    entity.options.push(new CheckboxPair(item, false))
                }
            }
            entity.displayProvider = this.displayProvider;
            entity.identifierProvider = this.identifierProvider;

            return entity;
        }
    }
}

export class FieldTypes {
    static RADIO = 'radio';
    static CHECKBOXES = 'checkboxes';
    static CHECKBOX = 'checkbox';
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