import { style } from '@angular/animations';
import { BehaviorSubject } from 'rxjs';

export interface DataGridItemModel {
    readonly key: string;
    readonly display: string;
    readonly type: string;
    readonly alwaysVisible: boolean;
    readonly columnStyle?: string;
    readonly columnClass?: string;
}

export abstract class DataGridItemBase implements DataGridItemModel {
    key: string;
    display: string;
    type: string;
    alwaysVisible: boolean;
    columnStyle?: string;
    columnClass?: string;

    static Builder = class {
        key: string;
        display: string;
        alwaysVisible: boolean = false;
        columnStyle?: string; 
        columnClass?: string;

        public setKey(key: string): this {
            this.key = key;
            return this;
        }

        public setDisplay(display: string): this{
            this.display = display;
            return this;
        }

        public setVisible(visible: boolean): this{
            this.alwaysVisible = visible;
            return this;
        }

        public setColumnStyle(columnStyle: string): this{
            this.columnStyle = columnStyle;
            return this;
        }

        public setColumnClass(columnClass: string): this{
            this.columnClass = columnClass;
            return this;
        }

        protected internalSetter(instance: DataGridItemBase, type: string) {
            instance.key = this.key;
            instance.display = this.display;
            instance.alwaysVisible = this.alwaysVisible;
            instance.columnStyle = this.columnStyle;
            instance.columnClass = this.columnClass;
            instance.type = type;
        }
    }
}

export interface DataGridItemTextModel extends DataGridItemModel {
    readonly textProvider?: Function;
}

export interface DataGridItemCheckboxModel extends DataGridItemModel {
    readonly textProvider?: Function;
    readonly valueProvider?: Function;
}

export interface DataGridItemButtonModel extends DataGridItemModel {
    readonly displayProvider: Function;
    readonly iconProvider?: Function;
    readonly classProvider?: Function;
    readonly access: BehaviorSubject<boolean>;
    readonly styleProvider?: Function
}

export interface DataGridItemInputModel extends DataGridItemModel {
    readonly access: BehaviorSubject<boolean>;
}

export interface DataGridItemImageModel extends DataGridItemModel {
    readonly src: string;
}

export class DataGridItemText extends DataGridItemBase implements DataGridItemTextModel {
    textProvider?: Function;

    static Builder = class extends DataGridItemBase.Builder {
        textProvider?: Function;

        public setTextProvider(textProvider: Function) : this{
            this.textProvider = textProvider;
            return this;
        }

        public build(): DataGridItemText {
            let entity = new DataGridItemText();
            super.internalSetter(entity, null);
            entity.textProvider = this.textProvider;

            return entity;
        }
    }
}

export class DataGridItemCheckbox extends DataGridItemBase implements DataGridItemCheckboxModel {
    textProvider?: Function;
    valueProvider?: Function;

    static Builder = class extends DataGridItemBase.Builder {
        textProvider?: Function;
        valueProvider?: Function;

        public setTextProvider(textProvider: Function) : this{
            this.textProvider = textProvider;
            return this;
        }

        public setValueProvider(valueProvider: Function) : this{
            this.valueProvider = valueProvider;
            return this;
        }

        public build(): DataGridItemCheckbox {
            let entity = new DataGridItemCheckbox();
            super.internalSetter(entity, FieldTypes.CHECKBOX);
            entity.textProvider = this.textProvider;
            entity.valueProvider = this.valueProvider;

            return entity;
        }
    }
}

export class DataGridItemButton extends DataGridItemBase implements DataGridItemButtonModel {
    displayProvider: Function;
    iconProvider?: Function;
    classProvider?: Function;
    access: BehaviorSubject<boolean>;
    styleProvider?: Function;

    static Builder = class extends DataGridItemBase.Builder {
        displayProvider: Function;
        iconProvider: Function;
        classProvider?: Function;
        access: BehaviorSubject<boolean>;
        styleProvider?: Function;

        public setTextProvider(displayProvider: Function) : this{
            this.displayProvider = displayProvider;
            return this;
        }

        public setIconProvider(iconProvider: Function) : this{
            this.iconProvider = iconProvider;
            return this;
        }

        public setClassProvider(classProvider: Function) : this{
            this.classProvider = classProvider;
            return this;
        }

        public setAccess(access: BehaviorSubject<boolean>): this{
            this.access = access;
            return this;
        }

        public setStyleProvider(styleProvider: Function): this{
            this.styleProvider = styleProvider;
            return this;
        }

        public build(): DataGridItemButton {
            let entity = new DataGridItemButton();
            super.internalSetter(entity, FieldTypes.BUTTON);
            entity.displayProvider = this.displayProvider;
            entity.iconProvider = this.iconProvider;
            entity.classProvider = this.classProvider;
            entity.access = this.access;
            entity.styleProvider = this.styleProvider;

            return entity;
        }
    }
}

export class DataGridItemInput extends DataGridItemBase implements DataGridItemInputModel {
    access: BehaviorSubject<boolean>;

    static Builder = class extends DataGridItemBase.Builder {
        access: BehaviorSubject<boolean>;

        public setAccess(access: BehaviorSubject<boolean>): this{
            this.access = access;
            return this;
        }

        public build(): DataGridItemInput {
            let entity = new DataGridItemInput();
            super.internalSetter(entity, FieldTypes.INPUT);
            entity.access = this.access;

            return entity;
        }
    }
}

export class DataGridItemImage extends DataGridItemBase implements DataGridItemImageModel {
    src: string;

    static Builder = class extends DataGridItemBase.Builder {
        src: string;

        public setSource(src: string): this{
            this.src = src;
            return this;
        }

        public build(): DataGridItemImage {
            let entity = new DataGridItemImage();
            super.internalSetter(entity, FieldTypes.IMAGE);
            entity.src = this.src;

            return entity;
        }
    }
}

export class FieldTypes {
    static INPUT = 'input';
    static IMAGE = 'img';
    static BUTTON = 'button';
    static CHECKBOX = 'checkbox';
}

export class DataGridConfig {
    constructor(public data: DataGridItemModel[]) {
    }

    add(item: DataGridItemModel) {
        this.data.push(item);
    }
}
