import { Component, Input } from '@angular/core';
import { Subject } from "rxjs";
import { DataGridConfig, DataGridItemButtonModel, DataGridItemModel, DataGridItemImageModel, DataGridItemInputModel, DataGridItemTextModel, DataGridItemCheckboxModel, DataGridItemListModel, DataGridItemList } from '../data-grid-config';

@Component({
  selector: 'data-grid-row',
  templateUrl: './data-grid-row.component.html',
  styleUrls: ['./data-grid-row.component.scss']
})
export class DataGridRowComponent {
  @Input() model: any;
  @Input() index: number;
  @Input() config: DataGridConfig;
  @Input() itemAction: Subject<any>;

  constructor() { }

  action(type, data) {
    this.itemAction.next({ type, data });
  }

  provideColumnClass(item: DataGridItemModel): string {
    return item.columnClass ? item.columnClass : ""
  }

  provideColumnStyle(item: DataGridItemModel): string {
    return item.columnStyle ? item.columnStyle : ""
  }

  castToButton(item: DataGridItemModel): DataGridItemButtonModel {
    return item as DataGridItemButtonModel;
  }

  castToImg(item: DataGridItemModel): DataGridItemImageModel {
    return item as DataGridItemImageModel;
  }

  castToInput(item: DataGridItemModel): DataGridItemInputModel {
    return item as DataGridItemInputModel;
  }

  castToCheckbox(item: DataGridItemModel): DataGridItemCheckboxModel {
    return item as DataGridItemCheckboxModel;
  }

  castToText(item: DataGridItemModel): DataGridItemTextModel {
    return item as DataGridItemTextModel;
  }

  castToList(item: DataGridItemModel): DataGridItemListModel {
    return item as DataGridItemListModel;
  }

  provideListObjects(item: DataGridItemModel, model: any): any[] {
    return this.castToList(item).valuesProvider(model)
  }

  provideListItemText(item: DataGridItemModel, model: any): string {
    return this.castToList(item)?.valuesTextProvider(model)
  }

  provideText(item: DataGridItemModel, model: any): string {
    return this.castToText(item)?.textProvider(model)
  }

  provideButtonInner(item: DataGridItemModel, model: any): string {
    let result = this.provideButtonIcon(item, model);
    result += this.provideButtonText(item, model);
    return result;
  }

  provideButtonText(item: DataGridItemModel, model: any): string {
    var provider = this.castToButton(item).displayProvider
    return provider ? provider(model) : ""
  }

  provideButtonIcon(item: DataGridItemModel, model: any): string {
    var provider = this.castToButton(item).iconProvider
    return provider ? provider(model) : ""
  }

  provideButtonClass(item: DataGridItemModel, model: any): string {
    var provider = this.castToButton(item).classProvider
    return provider ? provider(model) : "btn btn-secondary"
  }

  provideCheckboxValue(item: DataGridItemModel, model: any): boolean {
    return this.castToCheckbox(item).valueProvider(model);
  }

  provideEditableValue(item: DataGridItemModel, model: any): boolean {
    return item.editableProvider(model);
  }

  provideButtonStyle(item: DataGridItemModel, model: any): string {
    if (this.castToButton(item)?.styleProvider) {
      return this.castToButton(item)?.styleProvider(model)
    } else {
      return ""
    }
  }

  getVisibleAttributes(value: boolean) {
    return this.config.data.filter(d => d.alwaysVisible == value);
  }
}
