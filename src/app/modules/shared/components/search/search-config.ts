export interface SearchItemModel {
    type: string;
    key: string;
    display: string;
}

export abstract class SearchItemModelBase implements SearchItemModel{
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

        protected internalSetter(instance: SearchItemModelBase, type: string) {
            instance.key = this.key;
            instance.display = this.display;
            instance.type = type;
        }
    }
}

export interface SearchSelectModel extends SearchItemModel {
    readonly value?: string;
    readonly options?: any[];
    readonly displayProvider?: Function
    readonly identifierProvider?: Function
}

export class SearchSelect extends SearchItemModelBase implements SearchSelectModel {
    value?: string;
    options?: any[];
    displayProvider?: Function
    identifierProvider?: Function

    static Builder = class extends SearchItemModelBase.Builder {
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

        public build(): SearchSelect {
            let entity = new SearchSelect();
            super.internalSetter(entity, FieldTypes.SELECT);
            entity.value = this.value;
            entity.options = this.options;
            entity.displayProvider = this.displayProvider;
            entity.identifierProvider = this.identifierProvider;

            return entity;
        }
    }
}

export enum FieldTypes {
    INPUT_TEXT = 'INPUT_TEXT',
    INPUT_NUMBER = 'INPUT_NUMBER',
    SELECT = 'SELECT',
    IMAGE = 'IMAGE'
}

export class SearchConfig {

    constructor(public controls: SearchSelect[]) {
    }

    add(control: SearchSelect) {
        this.controls.push(control);
    }
}
