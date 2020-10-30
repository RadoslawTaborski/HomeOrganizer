import { Component, Input, OnInit } from '@angular/core';
import { ITemporaryItemModel, TemporaryItemTypes, TemporaryItemAction, TemporaryItemsFilters, TemporaryItemModel, TemporaryItemsFilterTypes } from './services/temporary-item.service.models'
import { BehaviorSubject, Subject, Subscription } from 'rxjs';
import { DataGridConfig, DataGridItemButton, DataGridItemCheckbox, DataGridItemText } from 'src/app/modules/shared/components/data-grid/data-grid-config';
import { AddItemConfig, AddItemInput, AddItemSelect } from 'src/app/modules/shared/components/modal/add/add-config';
import { SearchConfig, SearchSelect, FieldTypes as SearchFieldTypes } from 'src/app/modules/shared/components/search/search-config';
import { DataProviderService } from '../../services/data-provider.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { debounceTime } from 'rxjs/operators';
import { OperationsService } from '../../services/operations.service';
import { StateService } from 'src/app/root/services/state.service';
import { AddOption } from 'src/app/modules/shared/components/modal/add/add.component';
import { Category } from '../../settings/categories/services/categories.service.models';
import { SubCategory } from '../../settings/subcategories/services/subcategories.service.models';

@Component({
  selector: 'app-temporary-items',
  templateUrl: './temporary-items.component.html',
  styleUrls: ['./temporary-items.component.scss']
})
export class TemporaryItemsComponent implements OnInit {

  @Input() items: { data: ITemporaryItemModel[], total: number };
  shoppingListId: string

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
    public router: Router,
    private activatedRoute: ActivatedRoute,
    private stateService: StateService) {
  }

  ngOnDestroy(): void {
    this.filtersSubscriber.unsubscribe();
    this.itemActionSubscriber.unsubscribe();
  }

  async ngOnInit() {
    this.shoppingListId = this.activatedRoute.snapshot.paramMap.get('id');
    await this.dataProvider.reloadCategories();
    await this.dataProvider.reloadSubCategories();
    await this.dataProvider.reloadStates();

    this.translate.get('containers.items.name').subscribe(async (t) => {
      this.searchConfig = new SearchConfig([
        new SearchSelect.Builder()
        .setKey(TemporaryItemsFilterTypes.CATEGORY)
        .setDisplay(this.translate.instant('containers.items.category'))
        .setOptions(await this.operationsService.getCategories())
        .setDisplayProvider((t: Category) => t?.name)
        .setIdentifierProvider((t: Category) => t?.id)
        .build(),
      new SearchSelect.Builder()
        .setKey(TemporaryItemsFilterTypes.SUBCATEGORY)
        .setDisplay(this.translate.instant('containers.items.subcategory'))
        .setOptions(await this.operationsService.getSubCategories())
        .setDisplayProvider((t: SubCategory) => t?.name)
        .setIdentifierProvider((t: SubCategory) => t?.id)
        .build()
      ]);

      this.dataGridConfig = new DataGridConfig([
        new DataGridItemCheckbox.Builder()
          .setKey(TemporaryItemTypes.BOUGHT)
          .setDisplay(this.translate.instant('containers.items.temporary-item.bought'))
          .setValueProvider((t: ITemporaryItemModel): boolean => t.bought != null)
          .setColumnClass("exactValue")
          .setColumnStyle("--value: 40px;")
          .setVisible(true)
          .build(),
        new DataGridItemText.Builder()
          .setKey(TemporaryItemTypes.NAME)
          .setDisplay(this.translate.instant('containers.items.name'))
          .setColumnClass("absorbing-column")
          .setVisible(true)
          .build(),
        new DataGridItemText.Builder()
          .setKey(TemporaryItemTypes.CATEGORY)
          .setDisplay(this.translate.instant('containers.items.category'))
          .setTextProvider((t: ITemporaryItemModel): string => { return t.category.parent.name })
          .build(),
        new DataGridItemText.Builder()
          .setKey(TemporaryItemTypes.SUBCATEGORY)
          .setDisplay(this.translate.instant('containers.items.subcategory'))
          .setTextProvider((t: ITemporaryItemModel): string => t.category.name)
          .build(),
        new DataGridItemText.Builder()
          .setKey(TemporaryItemTypes.QUANTITY)
          .setDisplay(this.translate.instant('containers.items.temporary-item.quantity'))
          .setColumnClass("exactValue")
          .setColumnStyle("--value: 20%;")
          .setVisible(true)
          .build(),
        new DataGridItemButton.Builder()
          .setKey(TemporaryItemTypes.ARCHIVE)
          .setDisplay(this.translate.instant('containers.items.delete'))
          .setIconProvider(() => "<i class=\"fas fa-window-close\"></i>")
          .setClassProvider((t: ITemporaryItemModel) => "btn btn-danger")
          .setAccess(this.stateService.access)
          .setColumnClass("fitwidth")
          .setVisible(true)
          .build(),
      ]);

      this.addConfig = new AddItemConfig([
        new AddItemInput.Builder()
          .setKey(TemporaryItemTypes.NAME)
          .setDisplay(this.translate.instant('containers.items.name'))
          .build(),
        new AddItemInput.Builder()
          .setKey(TemporaryItemTypes.QUANTITY)
          .setDisplay(this.translate.instant('containers.items.temporary-item.quantity'))
          .build(),
        new AddItemSelect.Builder()
          .setKey(TemporaryItemTypes.SUBCATEGORY)
          .setDisplay(this.translate.instant('containers.items.subcategory'))
          .setOptions(await this.operationsService.getSubCategories())
          .setDisplayProvider((t: SubCategory) => t?.name)
          .setIdentifierProvider((t: SubCategory) => t?.id)
          .build()
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

  async update(data: TemporaryItemModel) {
    if (data.bought) {
      data.bought = null;
    } else {
      data.bought = new Date().toISOString();
    }
    await this.dataProvider.updateTemporaryItem(data);
  }

  async remove(data: TemporaryItemModel) {
    await this.dataProvider.removeTemporaryItem(data);
    window.location.reload();
  }

  async add(data: TemporaryItemModel) {
    await this.dataProvider.addTemporaryItem(data);
    window.location.reload();
  }

  async updateFilters(value?) {
    this.operationsService.updateFilters(this.category, this.subcategory, value);
    this.filters.next({ ...this.filters.value, ...value });
  }

  async fetchSubCategories() {
    this.operationsService.fetchSubCategories(this.category, this.subcategory);
  }

  async addItem(data: { result: AddOption, details: Map<string,any> }) {
    switch (data.result) {
      case 'ok':
        let item = new TemporaryItemModel({
          name: data.details.get(TemporaryItemTypes.NAME),
          category: this.dataProvider.subcategories.filter(i => i.id == data.details.get(TemporaryItemTypes.SUBCATEGORY))[0],
          quantity: data.details.get(TemporaryItemTypes.QUANTITY),
          shoppingListId: this.shoppingListId,
          groupId: this.dataProvider.group
        })

        await this.add(item);

        break;
      case 'dissmised': console.log('nok', data); break;
    }
  }
}
