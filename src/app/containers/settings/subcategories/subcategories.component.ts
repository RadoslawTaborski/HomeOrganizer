import { Component, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { DataGridConfig, DataGridItemText } from 'src/app/modules/shared/components/data-grid/data-grid-config';
import { AddItemConfig, AddItemInput, AddItemSelect } from 'src/app/modules/shared/components/modal/add/add-config';
import { AddOption } from 'src/app/modules/shared/components/modal/add/add.component';
import { ConfirmOption } from 'src/app/modules/shared/components/modal/confirm/modal-confirm.component';
import { SearchConfig, SearchSelect, FieldTypes as SearchFieldTypes } from 'src/app/modules/shared/components/search/search-config';
import { DataProviderService } from '../../services/data-provider.service';
import { OperationsService } from '../../services/operations.service';
import { Category } from '../categories/services/categories.service.models';
import { SubcartegoriesFilterTypes as SubcategoriesFilterTypes, SubcategoriesFilters, SubCategory, SubcategoryAction, SubcategoryTypes } from './services/subcategories.service.models';

@Component({
  selector: 'app-subcategories',
  templateUrl: './subcategories.component.html',
  styleUrls: ['./subcategories.component.scss']
})
export class SubcategoriesComponent implements OnInit {

  dataGridConfig: DataGridConfig;
  searchConfig: SearchConfig;
  addConfig: AddItemConfig;

  items: { data: SubCategory[], total: number };
  filters: BehaviorSubject<SubcategoriesFilters>;
  itemAction: Subject<SubcategoryAction>;
  filtersSubscriber: Subscription;
  itemActionSubscriber: Subscription;

  isLoaded: boolean = false;

  @ViewChild('confirmModal') confirmModal;
  toRemove: SubCategory;

  constructor(
    private dataProvider: DataProviderService,
    private translate: TranslateService,
    private operationsService: OperationsService) {
  }

  ngOnDestroy(): void {
    this.filtersSubscriber.unsubscribe();
    this.itemActionSubscriber.unsubscribe();
  }

  async ngOnInit() {
    await this.dataProvider.init();
    await this.dataProvider.reloadCategories();

    this.translate.get('containers.items.name').subscribe(async (t) => {
      await this.configuration();

      this.filters = new BehaviorSubject(new SubcategoriesFilters());
      this.itemAction = new Subject();

      this.filtersSubscriber = this.filters
        .pipe(debounceTime(500))
        .subscribe(async () => await this.fetch());

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

  async updateFilters(value?) {
    this.filters.next({ ...this.filters.value, ...value });
  }

  remove(data: SubCategory) {
    this.toRemove = data;
    this.confirmModal.clickButton();
  }

  async removeAction(data: { result: ConfirmOption, details: string, object: SubCategory }) {
    switch (data.result) {
      case 'ok':
        await this.removeItem(data.object);
        break;
      case 'dissmised': console.log('nok', data); break;
    }
  }

  async addItem(data: { result: AddOption, details: Map<string,any> }) {
    switch (data.result) {
      case 'ok':
        let obj = this.createFrom(data.details);
        this.add(obj);
        break;
      case 'dissmised': console.log('nok', data); break;
    }
  }

  async removeItem(data: SubCategory) {
    console.log("remove");
    this.ngOnInit();
  }

  async add(data: SubCategory) {
    await this.dataProvider.addSubcategories(data);
    this.ngOnInit();
  }

  async fetch() {
    await this.dataProvider.reloadSubCategories(this.filters.getValue()).then(v => {
      this.items = v;
    })
  }

  async more(data: SubCategory) {
    console.log("more");
  }

  async update(data: SubCategory) {
    console.log("update");
  }

  createFrom(data: Map<string,any>): SubCategory {
    return new SubCategory({
      name: data.get(SubcategoryTypes.NAME),
      parent: this.dataProvider.categories.filter(i => i.id == data.get(SubcategoryTypes.PARENT))[0],
      groupId: this.dataProvider.group.id
    })
  }

  async configuration() {
    this.searchConfig = new SearchConfig([
      new SearchSelect.Builder()
        .setKey(SubcategoriesFilterTypes.CATEGORY)
        .setDisplay(this.translate.instant('containers.settings.subcategories.category'))
        .setOptions(await this.operationsService.getCategories())
        .setDisplayProvider((t: Category) => t?.name)
        .setIdentifierProvider((t: Category) => t?.id)
        .build()
    ]);

    this.dataGridConfig = new DataGridConfig([
      new DataGridItemText.Builder()
        .setKey(SubcategoryTypes.NAME)
        .setDisplay(this.translate.instant('containers.settings.categories.name'))
        .setTextProvider((t: SubCategory): string => this.translateSubcategory(t))
        .setVisible(true)
        .setColumnClass("absorbing-column")
        .build(),
      new DataGridItemText.Builder()
        .setKey(SubcategoryTypes.PARENT)
        .setDisplay(this.translate.instant('containers.settings.categories.parent'))
        .setTextProvider((t: SubCategory): string => this.translateCategory(t.parent))
        .setColumnClass("fitwidth")
        .setVisible(true)
        .build(),
    ]);

    this.addConfig = new AddItemConfig([
      new AddItemInput.Builder()
        .setKey(SubcategoryTypes.NAME)
        .setDisplay(this.translate.instant('containers.settings.subcategories.name'))
        .build(),
      new AddItemSelect.Builder()
        .setKey(SubcategoryTypes.PARENT)
        .setDisplay(this.translate.instant('containers.settings.subcategories.parent'))
        .setOptions(await this.dataProvider.categories)
        .setDisplayProvider((t: Category) => this.translateCategory(t))
        .setIdentifierProvider((t: Category) => t?.id)
        .setValue(await this.dataProvider.categories.filter(i=>i.name=="none")[0].id)
        .build()
    ]);
  }

  translateSubcategory(t: SubCategory): string {
    if(!t){
      return "";
    }
    if(t.name == "none"){
      return this.translate.instant('containers.settings.subcategories.none');
    }
    return t.name;
  }

  translateCategory(t: Category): string {
    if(!t){
      return "";
    }
    if(t.name == "none"){
      return this.translate.instant('containers.settings.categories.none');
    }
    return t.name;
  }
}
