import { Component, Input, OnInit } from '@angular/core';
import { ITemporaryItemModel, TemporaryItemTypes, TemporaryItemAction, TemporaryItemsFilters, TemporaryItemModel, TemporaryItemsFilterTypes } from './services/temporary-item.service.models'
import { BehaviorSubject, Subject, Subscription } from 'rxjs';
import { DataGridConfig, DataGridItemText } from 'src/app/modules/shared/components/data-grid/data-grid-config';
import { AddItemConfig, AddItemInput, AddItemSelect } from 'src/app/modules/shared/components/modal/add/add-config';
import { SearchConfig, SearchControl, FieldTypes as SearchFieldTypes } from 'src/app/modules/shared/components/search/search-config';
import { Category, SubCategory } from '../models/models';
import { DataProviderService } from '../../services/data-provider.service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { debounceTime } from 'rxjs/operators';
import { OperationsService } from '../utils/operations.service';

@Component({
  selector: 'app-temporary-items',
  templateUrl: './temporary-items.component.html',
  styleUrls: ['./temporary-items.component.scss']
})
export class TemporaryItemsComponent implements OnInit {

  @Input() items: { data: ITemporaryItemModel[], total: number };

  dataGridConfig: DataGridConfig;
  searchConfig: SearchConfig;
  addConfig: AddItemConfig;

  filters: BehaviorSubject<TemporaryItemsFilters>;
  itemAction: Subject<TemporaryItemAction>;
  filtersSubscriber: Subscription;
  itemActionSubscriber: Subscription;

  subcategory: SubCategory[] = [];
  category: Category[] = [];
  isLoaded: boolean = false;

  constructor(
    private operationsService: OperationsService,
    private dataProvider: DataProviderService,
    private translate: TranslateService,
    public router: Router) { }

  ngOnDestroy(): void {
    this.filtersSubscriber.unsubscribe();
    this.itemActionSubscriber.unsubscribe();
  }

  async ngOnInit() {
    await this.dataProvider.reloadSubCategories();
    await this.dataProvider.reloadStates();

    this.translate.get('containers.items.name').subscribe(async (t) => {
      this.searchConfig = new SearchConfig([
        new SearchControl(SearchFieldTypes.SELECT, TemporaryItemsFilterTypes.CATEGORY, this.translate.instant('containers.items.category'), await this.operationsService.getCategories(), (t: Category) => t?.name, (t: Category) => t?.id),
        new SearchControl(SearchFieldTypes.SELECT, TemporaryItemsFilterTypes.SUBCATEGORY, this.translate.instant('containers.items.subcategory'), await this.operationsService.getSubCategories(), (t: SubCategory) => t?.name, (t: SubCategory) => t?.id),
      ]);

      this.dataGridConfig = new DataGridConfig([
        new DataGridItemText(TemporaryItemTypes.NAME, this.translate.instant('containers.items.name'), null, "75%", true),
        new DataGridItemText(TemporaryItemTypes.CATEGORY, this.translate.instant('containers.items.category'), (t: ITemporaryItemModel): string => t.category.parent.name),
        new DataGridItemText(TemporaryItemTypes.SUBCATEGORY, this.translate.instant('containers.items.subcategory'), (t: ITemporaryItemModel): string => t.category.name),
        new DataGridItemText(TemporaryItemTypes.QUANTITY, this.translate.instant('containers.items.temporary-item.quantity'), null, "25%", true),
      ]);

      this.addConfig = new AddItemConfig([
        new AddItemInput(TemporaryItemTypes.NAME, this.translate.instant('containers.items.name')),
        new AddItemInput(TemporaryItemTypes.QUANTITY, this.translate.instant('containers.items.temporary-item.quantity')),
        new AddItemSelect(TemporaryItemTypes.SUBCATEGORY, this.translate.instant('containers.items.subcategory'), null, await this.operationsService.getSubCategories(), (t: SubCategory) => t?.name, (t: SubCategory) => t?.id),
      ]);

      this.filters = new BehaviorSubject(new TemporaryItemsFilters());
      this.itemAction = new Subject();

      this.filtersSubscriber = this.filters
        .pipe(debounceTime(500))
        .subscribe(() => this.items);

      this.itemActionSubscriber = this.itemAction
        .subscribe((action) => {
          switch (action.type) {
            case 'add': this.add(action.data); break;
            case 'remove': this.remove(action.data); break;
            case 'update': this.update(action.data); break;
            case 'more': this.more(action.data); break;
          }
        });

      this.isLoaded = true;
    });
  }

  updateSearchConfig() {
    return this.searchConfig?.controls;
  }

  more(data: TemporaryItemModel) {
    console.log("more");
  }

  update(data: TemporaryItemModel) {
    console.log("update");
  }

  remove(data: TemporaryItemModel) {
    console.log("remove");
  }

  add(data: TemporaryItemModel) {
    console.log("add");
  }

  async updateFilters(value?) {
    this.operationsService.updateFilters(this.category, this.subcategory, value);
    this.filters.next({ ...this.filters.value, ...value });
  }

  async fetchSubCategories() {
    this.operationsService.fetchSubCategories(this.category, this.subcategory);
  }

  private replace(reference, array) {
    [].splice.apply(reference, [0, reference.length].concat(array));
  }

  addItem(data: any){
    console.log(data)
  }
}
