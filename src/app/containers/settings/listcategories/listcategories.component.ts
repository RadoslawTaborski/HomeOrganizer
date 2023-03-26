import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { DataGridConfig, DataGridItemText } from 'src/app/modules/shared/components/data-grid/data-grid-config';
import { AddItemConfig, AddItemInput } from 'src/app/modules/shared/components/modal/add/add-config';
import { AddOption } from 'src/app/modules/shared/components/modal/add/add.component';
import { ConfirmOption } from 'src/app/modules/shared/components/modal/confirm/modal-confirm.component';
import { SearchConfig } from 'src/app/modules/shared/components/search/search-config';
import { DataProviderService } from '../../services/data-provider.service';
import { ListcategoriesFilters, ListCategory, ListcategoryAction, ListcategoryTypes } from './services/listcategories.service.models';

@Component({
  selector: 'app-listcategories',
  templateUrl: './listcategories.component.html',
  styleUrls: ['./listcategories.component.scss']
})
export class ListcategoriesComponent implements OnInit {

  dataGridConfig: DataGridConfig;
  searchConfig: SearchConfig;
  addConfig: AddItemConfig;

  items: { data: ListCategory[], total: number };
  filters: BehaviorSubject<ListcategoriesFilters>;
  itemAction: Subject<ListcategoryAction>;
  filtersSubscriber: Subscription;
  itemActionSubscriber: Subscription;

  isLoaded: boolean = false;

  @ViewChild('confirmModal') confirmModal;
  toRemove: ListCategory;

  constructor(
    private dataProvider: DataProviderService,
    private translate: TranslateService,
    public router: Router) {
  }

  ngOnDestroy(): void {
    this.filtersSubscriber.unsubscribe();
    this.itemActionSubscriber.unsubscribe();
  }

  async ngOnInit() {
    await this.dataProvider.init();
    
    await this.translate.get('containers.settings.categories.name').subscribe(async t => {
      await this.configuration();

      this.filters = new BehaviorSubject(new ListcategoriesFilters());
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

  remove(data: ListCategory) {
    this.toRemove = data;
    this.confirmModal.clickButton();
  }

  async removeAction(data: { result: ConfirmOption, details: string, object: ListCategory }) {
    switch (data.result) {
      case 'ok':
        await this.removeItem(data.object);
        break;
      case 'dissmised': break;
    }
  }

  async addItem(data: { result: AddOption, details: Map<string,any> }) {
    switch (data.result) {
      case 'ok':
        let obj = this.createFrom(data.details);
        this.add(obj);
        break;
      case 'dissmised': break;
    }
  }

  async removeItem(data: ListCategory) {
    this.ngOnInit();
  }

  async add(data: ListCategory) {
    await this.dataProvider.addListCategories(data);
    this.ngOnInit();
  }

  async fetch() {
    await this.dataProvider.reloadListcategories(this.filters.getValue()).then(v => {
      this.items = v;
    })
  }

  async more(data: ListCategory) {
  }

  async update(data: ListCategory) {
  }

  createFrom(data: Map<string,any>): ListCategory {
    return new ListCategory({
      name: data.get(ListcategoryTypes.NAME),
      groupId: this.dataProvider.group.id
    })
  }

  translateCategory(t: ListCategory): string {
    if(!t){
      return "";
    }
    if(t.name == "none"){
      return this.translate.instant('containers.settings.listcategories.none');
    }
    return t.name;
  }

  async configuration() {
    this.dataGridConfig = new DataGridConfig([
      new DataGridItemText.Builder()
        .setKey(ListcategoryTypes.NAME)
        .setDisplay(this.translate.instant('containers.settings.listcategories.name'))
        .setTextProvider((t: ListCategory): string => this.translateCategory(t))
        .setVisible(true)
        .build(),
    ]);

    this.addConfig = new AddItemConfig([
      new AddItemInput.Builder()
        .setKey(ListcategoryTypes.NAME)
        .setDisplay(this.translate.instant('containers.settings.listcategories.name'))
        .build()
    ]);
  }
}
