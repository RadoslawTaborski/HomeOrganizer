export enum FieldTypes {
    INPUT_TEXT = 'INPUT_TEXT',
    INPUT_NUMBER = 'INPUT_NUMBER',
    SELECT = 'SELECT',
    IMAGE = 'IMAGE'
}

export interface SearchControlModel {
    tag: string;
    name: string;
    display: string;
    value?: string;
    options?: any[];
    displayProvider?: Function
    identifierProvider?: Function
}

export class SearchControl implements SearchControlModel {
    constructor(
        public tag,
        public name,
        public display,
        public options?,
        public displayProvider?,
        public identifierProvider?
    ) {
    }
}

export class SearchConfig {

    constructor(public controls: SearchControl[]) {
    }

    add(control: SearchControl) {
        this.controls.push(control);
    }
}
