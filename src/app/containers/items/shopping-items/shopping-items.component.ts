import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { DataGridConfig, DataGridItemCheckbox, DataGridItemText } from 'src/app/modules/shared/components/data-grid/data-grid-config';
import { SearchConfig, SearchSelect, FieldTypes as SearchFieldTypes } from 'src/app/modules/shared/components/search/search-config';
import { DataProviderService } from '../../services/data-provider.service';
import { Category } from '../../settings/categories/services/categories.service.models';
import { State } from '../../settings/states/services/states.service.models';
import { SubCategory } from '../../settings/subcategories/services/subcategories.service.models';
import { PermanentItemModel } from '../permanent-items/services/permanent-item.service.models';
import { ShoppingItemsFilters, IShoppingItemModel, ShoppingItemAction, ShoppingItemModel, ShoppingItemTypes, ShoppingItemsFilterTypes } from '../shopping-items/services/shopping-items.service.models'
import { TemporaryItemModel } from '../temporary-items/services/temporary-item.service.models';
import { OperationsService } from '../../services/operations.service'

@Component({
  selector: 'app-shopping-items',
  templateUrl: './shopping-items.component.html',
  styleUrls: ['./shopping-items.component.scss']
})
export class ShoppingItemsComponent implements OnInit {

  dataGridConfig: DataGridConfig;
  searchConfig: SearchConfig;

  items: { data: IShoppingItemModel[], total: number };
  filters: BehaviorSubject<ShoppingItemsFilters>;
  itemAction: Subject<ShoppingItemAction>;
  filtersSubscriber: Subscription;
  itemActionSubscriber: Subscription;

  subcategory: SubCategory[] = [];
  category: Category[] = [];
  isLoaded: boolean = false;

  constructor(
    private operationsService: OperationsService,
    private dataProvider: DataProviderService,
    private translate: TranslateService,
    public router: Router
  ) { }

  ngOnDestroy(): void {
    this.filtersSubscriber.unsubscribe();
    this.itemActionSubscriber.unsubscribe();
  }

  async ngOnInit() {
    await this.dataProvider.init();
    await this.dataProvider.reloadCategories();
    await this.dataProvider.reloadSubCategories();
    await this.dataProvider.reloadStates();

    await this.translate.get('containers.items.name').subscribe(async t => {
      this.searchConfig = new SearchConfig([
        new SearchSelect.Builder()
          .setKey(ShoppingItemsFilterTypes.CATEGORY)
          .setDisplay(this.translate.instant('containers.items.category'))
          .setOptions(await this.operationsService.getCategories())
          .setDisplayProvider((t: Category) => t?.name)
          .setIdentifierProvider((t: Category) => t?.id)
          .build(),
        new SearchSelect.Builder()
          .setKey(ShoppingItemsFilterTypes.SUBCATEGORY)
          .setDisplay(this.translate.instant('containers.items.subcategory'))
          .setOptions(await this.operationsService.getSubCategories())
          .setDisplayProvider((t: SubCategory) => t?.name)
          .setIdentifierProvider((t: SubCategory) => t?.id)
          .build()
      ]);

      this.dataGridConfig = new DataGridConfig([
        new DataGridItemCheckbox.Builder()
          .setKey(ShoppingItemTypes.BOUGHT)
          .setDisplay(this.translate.instant('containers.items.shopping.bought'))
          .setValueProvider((t: IShoppingItemModel): boolean => t.bought != null)
          .setColumnClass("exactValue")
          .setColumnStyle("--value: 40px;")
          .setVisible(true)
          .build(),
        new DataGridItemText.Builder()
          .setKey(ShoppingItemTypes.NAME)
          .setDisplay(this.translate.instant('containers.items.name'))
          .setColumnClass("absorbing-column")
          .setVisible(true)
          .build(),
        new DataGridItemText.Builder()
          .setKey(ShoppingItemTypes.STATE)
          .setDisplay(this.translate.instant('containers.items.shopping.state'))
          .setTextProvider((t: IShoppingItemModel): string => this.translateState(t))
          .setColumnClass("exactValue")
          .setColumnStyle("--value: 25%;")
          .setVisible(true)
          .build(),
        new DataGridItemText.Builder()
          .setKey(ShoppingItemTypes.CATEGORY)
          .setDisplay(this.translate.instant('containers.items.category'))
          .setTextProvider((t: IShoppingItemModel): string => t.category.parent.name)
          .build(),
        new DataGridItemText.Builder()
          .setKey(ShoppingItemTypes.SUBCATEGORY)
          .setDisplay(this.translate.instant('containers.items.subcategory'))
          .setTextProvider((t: IShoppingItemModel): string => t.category.name)
          .build(),
      ]);

      this.filters = new BehaviorSubject(new ShoppingItemsFilters());
      this.itemAction = new Subject();

      this.filtersSubscriber = this.filters
        .pipe(debounceTime(500))
        .subscribe(() => this.fetch());

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

  getStates(): State[] {
    return this.dataProvider.states
  }

  translateState(t: IShoppingItemModel): string {
    if (t.state != null) {
      switch (t.state) {
        case this.dataProvider.getCriticalState():
          return this.translate.instant('containers.items.shopping.critical');
        case this.dataProvider.getLittleState():
          return this.translate.instant('containers.items.shopping.little');
        case this.dataProvider.getMediumState():
          return this.translate.instant('containers.items.shopping.medium');
        case this.dataProvider.getLotState():
          return this.translate.instant('containers.items.shopping.lot');
      }
    } else {
      return t.quantity;
    }
  }

  updateSearchConfig() {
    return this.searchConfig?.controls;
  }

  buttonStyleProvider(data: ShoppingItemModel): string {
    switch (data.state) {
      case this.dataProvider.getCriticalState():
        return "background-color: darkred; width: 40px; height: 40px;"
      case this.dataProvider.getLittleState():
        return "background-color: red; width: 40px; height: 40px;"
      case this.dataProvider.getMediumState():
        return "background-color: orange; width: 40px; height: 40px;"
      case this.dataProvider.getLotState():
        return "background-color: green; width: 40px; height: 40px;"
    }
  }

  more(data: ShoppingItemModel) {
    console.log("more");
  }

  async update(data: ShoppingItemModel) {
    if (data.shoppingListId) {
      let temporaryItem = data as TemporaryItemModel
      temporaryItem.bought = new Date().toISOString();
      await this.dataProvider.updateTemporaryItem(temporaryItem);
    } else {
      let permanentItem = data as PermanentItemModel
      permanentItem.state = this.dataProvider.states.filter(i => i.id == "4")[0]
      permanentItem.counter = permanentItem.counter + 1;
      await this.dataProvider.updatePermanentItem(permanentItem);
    }
  }

  remove(data: ShoppingItemModel) {
    console.log("remove");
  }

  add(data: ShoppingItemModel) {
    console.log("add");
  }

  async updateFilters(value?) {
    this.operationsService.updateFilters(this.category, this.subcategory, value);
    this.filters.next({ ...this.filters.value, ...value });
  }

  async fetchSubCategories() {
    this.operationsService.fetchSubCategories(this.category, this.subcategory);
  }

  async fetch() {
    await this.dataProvider.getShoppingItems(this.filters.getValue()).then(v => {
      v.data.sort(i => i.categoryId)
      this.items = v;
    })
  }

  addItem(data: any) {
    console.log(data)
  }

}