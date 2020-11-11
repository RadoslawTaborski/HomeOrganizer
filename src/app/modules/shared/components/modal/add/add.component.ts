import { EventEmitter, Output } from '@angular/core';
import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { ModalBase } from '../modal-base';
import { AddItemCheckboxes, AddItemCheckboxesModel, AddItemCheckboxModel, AddItemConfig, AddItemInputModel, AddItemModel, AddItemRadioModel, AddItemSelect } from "../add/add-config"

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddComponent extends ModalBase implements OnInit {

  @Input() config: AddItemConfig;
  @Output() addAction = new EventEmitter<{ result: AddOption, details: string }>();

  constructor(modalService: NgbModal) {
    super(modalService);
  }

  ngOnInit(): void {
  }

  go(result: any) {
    if (typeof result !== "string") {
      //console.log(result)
      this.addAction.emit({ result: 'ok', details: result });
    } else {
      this.addAction.emit({ result: 'dissmised', details: result });
    }
  }

  onClickSubmit(data) {
    let dataMap = new Map<string, any>();
    Object.keys(data).forEach(function(key) {
      if(key.startsWith("array:")){
        let controlName = key.split(':').pop().split('[')[0]
        let identifier = key.split('[').pop().split(']')[0]
        if(data[key]==true){
          if(!dataMap.has(controlName)){
            dataMap.set(controlName,[]);
          }
          let tmp = dataMap.get(controlName)
          tmp.push(identifier)
          dataMap.set(controlName, tmp);
        }
      } else {
        dataMap.set(key,data[key])
      }
    })
    this.go(dataMap)
  }

  castToInput(data: AddItemModel): AddItemInputModel {
    return data as AddItemInputModel;
  }

  castToSelect(data: AddItemModel): AddItemSelect {
    return data as AddItemSelect;
  }

  castToCheckboxes(data: AddItemModel): AddItemCheckboxesModel {
    return data as AddItemCheckboxesModel;
  }

  castToCheckbox(data: AddItemModel): AddItemCheckboxModel {
    return data as AddItemCheckboxModel;
  }

  provideCheckboxText(item: AddItemModel, model: any): string {
    return this.castToCheckbox(item)?.displayProvider(model)
  }

  provideCheckboxesText(item: AddItemModel, model: any): string {
    return this.castToCheckboxes(item)?.displayProvider(model)
  }

  provideCheckboxIdentifier(item: AddItemModel, model: any): string {
    return this.castToCheckboxes(item)?.identifierProvider(model)
  }

  castToRadio(data: AddItemModel): AddItemRadioModel {
    return data as AddItemRadioModel;
  }

  provideRadioText(item: AddItemModel, model: any): string {
    return this.castToRadio(item)?.displayProvider(model)
  }

  provideRadioIdentifier(item: AddItemModel, model: any): string {
    return this.castToRadio(item)?.identifierProvider(model)
  }

  provideSelectText(item: AddItemModel, model: any): string {
    return this.castToSelect(item)?.displayProvider(model)
  }

  provideSelectIdentifier(item: AddItemModel, model: any) {
    return this.castToSelect(item)?.identifierProvider(model)
  }

}

export type AddOption = 'ok' | 'dissmised';
