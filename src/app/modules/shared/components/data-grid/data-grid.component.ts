import { Component, Input } from '@angular/core';
import { Subject } from "rxjs";
import { DataGridConfig } from './data-grid-config';

@Component({
    selector: 'app-datagrid',
    templateUrl: './data-grid.component.html'
})

export class DataGridComponent {
    @Input() data: any[];
    @Input() config: DataGridConfig;
    @Input() itemAction: Subject<any>;
}
