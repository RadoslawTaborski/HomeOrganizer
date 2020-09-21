import { Component, OnInit } from '@angular/core';
import { IPermanentItemModel, PermanentItemTypes, State, PermanentItemAction, PermanentItemsFilters, PermanentItemModel, PermanentItemsFilterTypes } from './services/permanent-item.service.models'
import { PermanentItemService } from './services/permanent-item.service'
import { DataGridConfig, DataGridItemText, DataGridItemButton } from '../../../modules/shared/components/data-grid/data-grid-config';
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
import { DataProviderService } from '../../services/data-provider.service';

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
    private dataProvider: DataProviderService,
    private translate: TranslateService,
    public stateService: StateService,
    public router: Router) {
  }

  ngOnDestroy(): void {
    this.filtersSubscriber.unsubscribe();
    this.itemActionSubscriber.unsubscribe();
  }

  async ngOnInit() {
    await this.dataProvider.reloadSubCategories();
    await this.dataProvider.reloadStates();
    
    await this.translate.get('containers.items.name').subscribe(async t => {
      this.searchConfig = new SearchConfig([
        new SearchControl(SearchFieldTypes.SELECT, PermanentItemsFilterTypes.CATEGORY, this.translate.instant('containers.items.category'), null, await this.getCategories(), (t: Category) => t?.name, (t: Category) => t?.id),
        new SearchControl(SearchFieldTypes.SELECT, PermanentItemsFilterTypes.SUBCATEGORY, this.translate.instant('containers.items.subcategory'), null, await this.getSubCategories(), (t: SubCategory) => t?.name, (t: SubCategory) => t?.id),
        new SearchControl(SearchFieldTypes.SELECT, PermanentItemsFilterTypes.STATE, this.translate.instant('containers.items.permanent-item.state'), null, await this.getStates(), (t: State) => this.translateState(t), (t: State) => t.id),
      ]);

      this.dataGridConfig = new DataGridConfig([
        new DataGridItemText(PermanentItemTypes.NAME, this.translate.instant('containers.items.name'), null, "50%", true),
        new DataGridItemText(PermanentItemTypes.CATEGORY, this.translate.instant('containers.items.category'), (t: IPermanentItemModel): string => t.category.parent.name),
        new DataGridItemText(PermanentItemTypes.SUBCATEGORY, this.translate.instant('containers.items.subcategory'), (t: IPermanentItemModel): string => t.category.name),
        new DataGridItemButton(PermanentItemTypes.STATE, this.translate.instant('containers.items.permanent-item.state'), () => "", this.stateService.access, (t: IPermanentItemModel) => this.buttonStyleProvider(t), "25%", true),
        new DataGridItemText(PermanentItemTypes.DATE, this.translate.instant('containers.items.permanent-item.lastUpdate'), null, "25%", true),
      ]);

      this.addConfig = new AddItemConfig([
        new AddItemInput(PermanentItemsFilterTypes.NAME, this.translate.instant('containers.items.name')),
        new AddItemSelect(PermanentItemTypes.SUBCATEGORY, this.translate.instant('containers.items.subcategory'), null, await this.getSubCategories(), (t: SubCategory) => t?.name, (t: SubCategory) => t?.id),
      ]);

      this.filters = new BehaviorSubject(new PermanentItemsFilters());
      this.itemAction = new Subject();

      this.filtersSubscriber = this.filters
        .pipe(debounceTime(500))
        .subscribe(async () => await this.fetch());

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
    return this.dataProvider.states
  }

  translateState(t: State): string {
    switch (t) {
      case this.dataProvider.getCriticalState():
        return this.translate.instant('containers.items.permanent-item.critical');
      case this.dataProvider.getLittleState():
        return this.translate.instant('containers.items.permanent-item.little');
      case this.dataProvider.getMediumState():
        return this.translate.instant('containers.items.permanent-item.medium');
      case this.dataProvider.getLotState():
        return this.translate.instant('containers.items.permanent-item.lot');
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

  buttonStyleProvider(data: PermanentItemModel): string {
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
    await this.dataProvider.getPermanentItems(this.filters.getValue()).then(v => {
      debugger;
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

  addItem(data: any){
    console.log(data)
  }
}
