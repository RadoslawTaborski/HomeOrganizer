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
  @Input() searchConfig: SearchConfig;
  @Input() addConfig: AddItemConfig;

  @Input() filters: any;
  @Input() items: any;
  @Input() action: any;

  @Output() updFilters = new EventEmitter();
  @Output() addAction = new EventEmitter();

  filterVisible: boolean;

  constructor() { }

  ngOnInit(): void {
  }

  openFilter(){
    this.filterVisible = true;
  }

  closeFilter(){
    this.filterVisible = false;
  }

  addItem(data: any){
    this.addAction.emit(data);
  }

  updateFilters(value?) {
    this.updFilters.emit(value);
  }
}
