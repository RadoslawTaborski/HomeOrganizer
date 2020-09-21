import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { DataGridConfig, DataGridItemCheckbox, DataGridItemText } from 'src/app/modules/shared/components/data-grid/data-grid-config';
import { SearchConfig, SearchControl, FieldTypes as SearchFieldTypes } from 'src/app/modules/shared/components/search/search-config';
import { StateService } from 'src/app/root/services/state.service';
import { DataProviderService } from '../../services/data-provider.service';
import { Category, SubCategory } from '../models/models';
import { State } from '../permanent-items/services/permanent-item.service.models';
import { CategoryService } from '../services/category/category.service';
import { SubcategoryService } from '../services/subcategory/subcategory.service';
import { ShoppingItemsFilters, IShoppingItemModel, ShoppingItemAction, ShoppingItemModel, ShoppingItemTypes, ShoppingItemsFilterTypes } from '../shopping-items/services/shopping-items.service.models'
import { ShoppingItemsService } from './services/shopping-items.service'

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
    private dataProvider: DataProviderService,
    private translate: TranslateService,
    public stateService: StateService,
    public router: Router
  ) { }

  ngOnDestroy(): void {
    this.filtersSubscriber.unsubscribe();
    this.itemActionSubscriber.unsubscribe();
  }

  async ngOnInit() {
    await this.dataProvider.reloadSubCategories();
    await this.dataProvider.reloadStates();

    await this.translate.get('containers.items.name').subscribe(async t => {
      this.searchConfig = new SearchConfig([
        new SearchControl(SearchFieldTypes.SELECT, ShoppingItemsFilterTypes.CATEGORY, this.translate.instant('containers.items.category'), null, await this.getCategories(), (t: Category) => t?.name, (t: Category) => t?.id),
        new SearchControl(SearchFieldTypes.SELECT, ShoppingItemsFilterTypes.SUBCATEGORY, this.translate.instant('containers.items.subcategory'), null, await this.getSubCategories(), (t: SubCategory) => t?.name, (t: SubCategory) => t?.id),
      ]);

      this.dataGridConfig = new DataGridConfig([
        new DataGridItemCheckbox(ShoppingItemTypes.BOUGHT, this.translate.instant('containers.items.shopping.bought'), null, "10%", true),
        new DataGridItemText(ShoppingItemTypes.NAME, this.translate.instant('containers.items.name'), null, "65%", true),
        new DataGridItemText(ShoppingItemTypes.STATE, this.translate.instant('containers.items.shopping.state'), (t: IShoppingItemModel): string => this.translateState(t), "25%", true),
        new DataGridItemText(ShoppingItemTypes.CATEGORY, this.translate.instant('containers.items.category'), (t: IShoppingItemModel): string => t.category.parent.name),
        new DataGridItemText(ShoppingItemTypes.SUBCATEGORY, this.translate.instant('containers.items.subcategory'), (t: IShoppingItemModel): string => t.category.name),
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

  private async getCategories(subcategoryId?: string) {
    await this.updateCategories(subcategoryId)

    return this.category;
  }

  private async getSubCategories(categoryId?: string) {
    await this.updateSubCategories(categoryId)
    this.subcategory.unshift(null);

    return this.subcategory;
  }

  private async updateCategories(subcategoryId?: string) {
    if (subcategoryId) {
      this.replace(this.category, this.dataProvider.categories.filter(c => c.id === this.subcategory.filter(t => t?.id === subcategoryId)[0].parent.id))
    } else {
      this.category.unshift(null);
    }
  }

  private async updateSubCategories(categoryId?: string) {
    if (categoryId) {
      this.replace(this.subcategory, this.dataProvider.subcategories.filter(c => c.parent.id === categoryId))
    }
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

  update(data: ShoppingItemModel) {
    console.log("update");
  }

  remove(data: ShoppingItemModel) {
    console.log("remove");
  }

  add(data: ShoppingItemModel) {
    console.log("add");
  }

  changeState(data: ShoppingItemModel) {
    console.log("change state")
  }

  async updateFilters(value?) {
    if (value.category && value.category !== "null") {
      await this.getSubCategories(value.category);
      await this.getCategories()
    } else if (value.subcategory && value.subcategory !== "null") {
      await this.getCategories(value.subcategory);
    } else {
      await this.getCategories()
      await this.getSubCategories()
    }
    this.filters.next({ ...this.filters.value, ...value });
  }

  async fetch() {
    await this.dataProvider.getShoppingItems(this.filters.getValue()).then(v => {
      v.data.sort(i => i.sta)
      this.items = v;
    })
  }

  async fetchSubCategories() {
    await this.dataProvider.reloadSubCategories();
    
    this.replace(this.category, this.dataProvider.categories)
    this.replace(this.subcategory, this.dataProvider.subcategories)
  }

  private replace(reference, array) {
    [].splice.apply(reference, [0, reference.length].concat(array));
  }

  addItem(data: any) {
    console.log(data)
  }

}