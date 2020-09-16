import { Component, Input, OnInit } from '@angular/core';
import { ITemporaryItemModel, TemporaryItemTypes, TemporaryItemAction, TemporaryItemsFilters, TemporaryItemModel, TemporaryItemsFilterTypes } from './services/temporary-item.service.models'
import { TemporaryItemService } from './services/temporary-item.service'
import { BehaviorSubject, Subject, Subscription } from 'rxjs';
import { DataGridConfig, DataGridItemText } from 'src/app/modules/shared/components/data-grid/data-grid-config';
import { AddItemConfig, AddItemInput, AddItemSelect } from 'src/app/modules/shared/components/modal/add/add-config';
import { SearchConfig, SearchControl, FieldTypes as SearchFieldTypes } from 'src/app/modules/shared/components/search/search-config';
import { Category, SubCategory } from '../models/models';
import { CategoryService } from '../services/category/category.service';
import { SubcategoryService } from '../services/subcategory/subcategory.service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { StateService } from 'src/app/root/services/state.service';
import { debounceTime } from 'rxjs/operators';

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
    public categoryService: CategoryService,
    public subcategoryService: SubcategoryService,
    private translate: TranslateService,
    public stateService: StateService,
    public router: Router) { }

  ngOnDestroy(): void {
    this.filtersSubscriber.unsubscribe();
    this.itemActionSubscriber.unsubscribe();
  }

  async ngOnInit() {
    await this.fetchCategories();
    await this.fetchSubCategories();

    this.translate.get('containers.items.name').subscribe(async (t) => {
      this.searchConfig = new SearchConfig([
        new SearchControl(SearchFieldTypes.INPUT_TEXT, TemporaryItemsFilterTypes.NAME, this.translate.instant('containers.items.name')),
        new SearchControl(SearchFieldTypes.SELECT, TemporaryItemsFilterTypes.CATEGORY, this.translate.instant('containers.items.category'), null, await this.getCategories(), (t: Category) => t?.name, (t: Category) => t?.id),
        new SearchControl(SearchFieldTypes.SELECT, TemporaryItemsFilterTypes.SUBCATEGORY, this.translate.instant('containers.items.subcategory'), null, await this.getSubCategories(), (t: SubCategory) => t?.name, (t: SubCategory) => t?.id),
      ]);

      this.dataGridConfig = new DataGridConfig([
        new DataGridItemText(TemporaryItemTypes.NAME, this.translate.instant('containers.items.name'), null, "75%", true),
        new DataGridItemText(TemporaryItemTypes.CATEGORY, this.translate.instant('containers.items.category'), (t: ITemporaryItemModel): string => t.category.parent.name),
        new DataGridItemText(TemporaryItemTypes.SUBCATEGORY, this.translate.instant('containers.items.subcategory'), (t: ITemporaryItemModel): string => t.category.name),
        new DataGridItemText(TemporaryItemTypes.QUANTITY, this.translate.instant('containers.items.temporary-item.quantity'), null, "25%", true),
      ]);

      this.addConfig = new AddItemConfig([
        new AddItemInput(TemporaryItemsFilterTypes.NAME, this.translate.instant('containers.items.name')),
        new AddItemSelect(TemporaryItemTypes.SUBCATEGORY, this.translate.instant('containers.items.subcategory'), null, await this.getSubCategories(), (t: SubCategory) => t?.name, (t: SubCategory) => t?.id),
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
