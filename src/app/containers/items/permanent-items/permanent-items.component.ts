import { Component, OnInit, DebugElement } from '@angular/core';
import { IPermanentItemModel, PermanentItemTypes, State, PermanentItemAction, PermanentItemsFilters, PermanentItemModel, PermanentItemsFilterTypes } from './services/permanent-item.service.models'
import { PermanentItemService } from './services/permanent-item.service'
import { DataGridConfig, DataGridItemModel, DataGridItemText, DataGridItemButton, DataGridItemInput, DataGridItemImage } from '../../../modules/shared/components/data-grid/data-grid-config';
import { StateService } from 'src/app/root/services/state.service';
import { Router } from '@angular/router';
import { BehaviorSubject, Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { SearchConfig, SearchControl, FieldTypes as SearchFieldTypes } from 'src/app/modules/shared/components/search/search-config';
import { CategoryService } from '../services/category/category.service';
import { SubcategoryService } from '../services/subcategory/subcategory.service';
import { SubCategory, Category } from '../models/models';
import { TranslateService } from '@ngx-translate/core';
import { AddItemConfig, AddItemInput, AddItemSelect } from 'src/app/modules/shared/components/modal/add/add-config';

@Component({
  selector: 'app-permanent-items',
  templateUrl: './permanent-items.component.html',
  styleUrls: ['./permanent-items.component.scss']
})
export class PermanentItemsComponent implements OnInit {

  dataGridConfig: DataGridConfig;
  searchConfig: SearchConfig;
  addConfig: AddItemConfig;

  items: { data: IPermanentItemModel[], total: number };
  filters: BehaviorSubject<PermanentItemsFilters>;
  itemAction: Subject<PermanentItemAction>;
  filtersSubscriber: Subscription;
  itemActionSubscriber: Subscription;

  subcategory: SubCategory[] = [];
  category: Category[] = [];
  isLoaded: boolean = false;

  constructor(
    public itemsService: PermanentItemService,
    public categoryService: CategoryService,
    public subcategoryService: SubcategoryService,
    public statusService: StateService,
    private translate: TranslateService,
    public stateService: StateService,
    public router: Router) {
  }

  ngOnDestroy(): void {
    this.filtersSubscriber.unsubscribe();
    this.itemActionSubscriber.unsubscribe();
  }

  async ngOnInit() {
    await this.fetchCategories();
    await this.fetchSubCategories();

    await this.translate.get('containers.permanent-item.name').subscribe(async t => {
      this.searchConfig = new SearchConfig([
        new SearchControl(SearchFieldTypes.INPUT_TEXT, PermanentItemsFilterTypes.NAME, this.translate.instant('containers.permanent-item.name')),
        new SearchControl(SearchFieldTypes.SELECT, PermanentItemsFilterTypes.CATEGORY, this.translate.instant('containers.permanent-item.category'), null, await this.getCategories(), (t: Category) => t?.name, (t: Category) => t?.id),
        new SearchControl(SearchFieldTypes.SELECT, PermanentItemsFilterTypes.SUBCATEGORY, this.translate.instant('containers.permanent-item.subcategory'), null, await this.getSubCategories(), (t: SubCategory) => t?.name, (t: SubCategory) => t?.id),
        new SearchControl(SearchFieldTypes.SELECT, PermanentItemsFilterTypes.STATE, this.translate.instant('containers.permanent-item.state'), null, await this.getStates(), (t: State) => this.translateState(t), (t: State) => State[t]),
      ]);

      this.dataGridConfig = new DataGridConfig([
        new DataGridItemText(PermanentItemTypes.NAME, this.translate.instant('containers.permanent-item.name')),
        new DataGridItemText(PermanentItemTypes.CATEGORY, this.translate.instant('containers.permanent-item.category'), (t: IPermanentItemModel): string => t.category.parent.name, false),
        new DataGridItemText(PermanentItemTypes.SUBCATEGORY, this.translate.instant('containers.permanent-item.subcategory'), (t: IPermanentItemModel): string => t.category.name, false),
        new DataGridItemButton(PermanentItemTypes.STATE, this.translate.instant('containers.permanent-item.state'), () => "", this.stateService.access, (t: IPermanentItemModel) => this.buttonStyleProvider(t)),
        new DataGridItemText(PermanentItemTypes.DATE, this.translate.instant('containers.permanent-item.lastUpdate')),
      ]);

      this.addConfig = new AddItemConfig([
        new AddItemInput(PermanentItemsFilterTypes.NAME, this.translate.instant('containers.permanent-item.name')),
        new AddItemSelect(PermanentItemTypes.SUBCATEGORY, this.translate.instant('containers.permanent-item.subcategory'), null, await this.getSubCategories(), (t: SubCategory) => t?.name, (t: SubCategory) => t?.id),
      ]);

      this.filters = new BehaviorSubject(new PermanentItemsFilters());
      this.itemAction = new Subject();

      this.filtersSubscriber = this.filters
        .pipe(debounceTime(500))
        .subscribe(() => this.fetch());

      this.itemActionSubscriber = this.itemAction
        .subscribe((action) => {
          switch (action.type) {
            case 'state': this.changeState(action.data); break;
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

  translateState(t: State): string {
    switch (t) {
      case State.CRITICAL:
        return this.translate.instant('containers.permanent-item.critical');
      case State.LITTLE:
        return this.translate.instant('containers.permanent-item.little');
      case State.MEDIUM:
        return this.translate.instant('containers.permanent-item.medium');
      case State.LOT:
        return this.translate.instant('containers.permanent-item.lot');
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

  buttonStyleProvider(data: PermanentItemModel): string {
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

  more(data: PermanentItemModel) {
    console.log("more");
  }

  update(data: PermanentItemModel) {
    console.log("update");
  }

  remove(data: PermanentItemModel) {
    console.log("remove");
  }

  add(data: PermanentItemModel) {
    console.log("add");
  }

  changeState(data: PermanentItemModel) {
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

  addItem(data: any){
    console.log(data)
  }
}
