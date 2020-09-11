import { Component, Input } from '@angular/core';
import { Subject } from "rxjs";
import { DataGridConfig, DataGridItemButtonModel, DataGridItemModel, DataGridItemImageModel, DataGridItemInputModel, DataGridItemTextModel } from '../data-grid-config';

@Component({
    selector: '[data-grid-row]',
    templateUrl: './data-grid-row.component.html'
})
export class DataGridRowComponent {
    @Input() model: any;
    @Input() config: DataGridConfig;
    @Input() itemAction: Subject<any>;

    constructor() { }

    action(type, data) {
        this.itemAction.next({ type, data });
    }

    castToButton(item: DataGridItemModel): DataGridItemButtonModel{
        return item as DataGridItemButtonModel;
    }

    castToImg(item: DataGridItemModel): DataGridItemImageModel{
        return item as DataGridItemImageModel;
    }

    castToInput(item: DataGridItemModel): DataGridItemInputModel{
        return item as DataGridItemInputModel;
    }

    castToText(item: DataGridItemModel): DataGridItemTextModel{
        return item as DataGridItemTextModel;
    }

    provideText(item: DataGridItemModel, model: any): string {
        return this.castToText(item)?.textProvider(model)
    }

    provideButtonText(item: DataGridItemModel, model: any): string {
        return this.castToButton(item).displayProvider(model)
    }

    provideButtonStyle(item: DataGridItemModel, model: any): string {
        if(this.castToButton(item)?.styleProvider){
            return this.castToButton(item)?.styleProvider(model)
        } else {
            return ""
        }
    }
}
