import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DataGridConfig } from '../data-grid/data-grid-config';
import { AddItemConfig } from '../modal/add/add-config';
import { SearchConfig } from '../search/search-config';

@Component({
  selector: 'app-grid-search-add',
  templateUrl: './grid-search-add.component.html',
  styleUrls: ['./grid-search-add.component.scss']
})
export class GridSearchAddComponent implements OnInit {

  @Input() dataGridConfig: DataGridConfig;
  @Input() items: any;
  @Input() action: any;
  @Input() badgeItemName: string;

  @Input() filterOn: boolean;
  @Input() searchConfig: SearchConfig;
  @Input() filters: any;
  @Output() updFilters = new EventEmitter();

  @Input() addOn: boolean;
  @Input() addConfig: AddItemConfig;
  @Output() addAction = new EventEmitter();

  @Input() actionOn: boolean;
  @Input() actionClass: string;
  @Output() actionAction = new EventEmitter();

  filterVisible: boolean;

  constructor() { }

  ngOnInit(): void {
  }

  openFilter() {
    this.filterVisible = true;
  }

  takeAction() {
    this.actionAction.emit();
  }

  closeFilter() {
    this.filterVisible = false;
  }

  addItem(data: any) {
    this.addAction.emit(data);
  }

  updateFilters(value?) {
    this.updFilters.emit(value);
  }
}
