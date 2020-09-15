import { EventEmitter, Output } from '@angular/core';
import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { ModalBase } from '../modal-base';
import { AddItemConfig, AddItemModel, AddItemSelect } from "../add/add-config"

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddComponent extends ModalBase implements OnInit {

  @Input() config: AddItemConfig;
  @Output() addAction = new EventEmitter();

  constructor(modalService: NgbModal) {
    super(modalService);
  }

  ngOnInit(): void {
  }

  go(result: any) {
    this.addAction.emit(result);
  }

  onClickSubmit(data) {
    this.go(data)
  }

  castToSelect(data: AddItemModel): AddItemSelect {
    return data as AddItemSelect;
  }

  provideSelectText(item: AddItemModel, model: any): string {
    return this.castToSelect(item)?.displayProvider(model)
  }

  provideSelectIdentifier(item: AddItemModel, model: any) {
    return this.castToSelect(item)?.identifierProvider(model)
  }

}
