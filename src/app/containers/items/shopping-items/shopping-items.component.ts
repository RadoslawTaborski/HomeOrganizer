import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { DataGridConfig, DataGridItemText } from 'src/app/modules/shared/components/data-grid/data-grid-config';
import { SearchConfig, SearchControl, FieldTypes as SearchFieldTypes } from 'src/app/modules/shared/components/search/search-config';
import { StateService } from 'src/app/root/services/state.service';
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
    public itemsService: ShoppingItemsService,
    public categoryService: CategoryService,
    public subcategoryService: SubcategoryService,
    private translate: TranslateService,
    public stateService: StateService,
    public router: Router
  ) { }

  ngOnDestroy(): void {
    this.filtersSubscriber.unsubscribe();
    this.itemActionSubscriber.unsubscribe();
  }

  async ngOnInit() {
    await this.fetchCategories();
    await this.fetchSubCategories();

    await this.translate.get('containers.items.name').subscribe(async t => {
      this.searchConfig = new SearchConfig([
        new SearchControl(SearchFieldTypes.SELECT, ShoppingItemsFilterTypes.CATEGORY, this.translate.instant('containers.items.category'), null, await this.getCategories(), (t: Category) => t?.name, (t: Category) => t?.id),
        new SearchControl(SearchFieldTypes.SELECT, ShoppingItemsFilterTypes.SUBCATEGORY, this.translate.instant('containers.items.subcategory'), null, await this.getSubCategories(), (t: SubCategory) => t?.name, (t: SubCategory) => t?.id),
      ]);

      this.dataGridConfig = new DataGridConfig([
        new DataGridItemText(ShoppingItemTypes.NAME, this.translate.instant('containers.items.name'), null, "75%", true),
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
    return [State.CRITICAL, State.LITTLE, State.LOT, State.MEDIUM]
  }

  translateState(t: IShoppingItemModel): string {
    if (t.state != null) {
      switch (t.state) {
        case State.CRITICAL:
          return this.translate.instant('containers.items.shopping.critical');
        case State.LITTLE:
          return this.translate.instant('containers.items.shopping.little');
        case State.MEDIUM:
          return this.translate.instant('containers.items.shopping.medium');
        case State.LOT:
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
    await this.fetchCategories();
    if (subcategoryId) {
      this.replace(this.category, this.category.filter(c => c.id === this.subcategory.filter(t => t?.id === subcategoryId)[0].parent.id))
    } else {
      this.category.unshift(null);
    }
  }

  private async updateSubCategories(categoryId?: string) {
    await this.fetchSubCategories();
    if (categoryId) {
      this.replace(this.subcategory, this.subcategory.filter(c => c.parent.id === categoryId))
    }
  }

  buttonStyleProvider(data: ShoppingItemModel): string {
    switch (data.state) {
      case State.CRITICAL:
        return "background-color: darkred; width: 40px; height: 40px;"
      case State.LITTLE:
        return "background-color: red; width: 40px; height: 40px;"
      case State.MEDIUM:
        return "background-color: orange; width: 40px; height: 40px;"
      case State.LOT:
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
    await this.itemsService.fetch(this.filters.getValue()).then(v => {
      v.data.sort(i => i.sta)
      this.items = v;
    })
  }

  async fetchSubCategories() {
    await this.subcategoryService.fetch().then(v => {
      this.replace(this.subcategory, v.data);
    })
  }

  async fetchCategories() {
    await this.categoryService.fetch().then(v => {
      this.replace(this.category, v.data);
    })
  }

  private replace(reference, array) {
    [].splice.apply(reference, [0, reference.length].concat(array));
  }

  addItem(data: any) {
    console.log(data)
  }

}