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
import { CategoriesFilters, Category, CategoryAction, CategoryTypes } from './services/categories.service.models';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {

  dataGridConfig: DataGridConfig;
  searchConfig: SearchConfig;
  addConfig: AddItemConfig;

  items: { data: Category[], total: number };
  filters: BehaviorSubject<CategoriesFilters>;
  itemAction: Subject<CategoryAction>;
  filtersSubscriber: Subscription;
  itemActionSubscriber: Subscription;

  isLoaded: boolean = false;

  @ViewChild('confirmModal') confirmModal;
  toRemove: Category;

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
    await this.translate.get('containers.settings.categories.name').subscribe(async t => {
      await this.configuration();

      this.filters = new BehaviorSubject(new CategoriesFilters());
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

  remove(data: Category) {
    this.toRemove = data;
    this.confirmModal.clickButton();
  }

  async removeAction(data: { result: ConfirmOption, details: string, object: Category }) {
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

  async removeItem(data: Category) {
    console.log("remove");
    window.location.reload();
  }

  async add(data: Category) {
    await this.dataProvider.addCategories(data);
    window.location.reload();
  }

  async fetch() {
    await this.dataProvider.reloadCategories(this.filters.getValue()).then(v => {
      this.items = v;
    })
  }

  async more(data: Category) {
    console.log("more");
  }

  async update(data: Category) {
    console.log("update");
  }

  createFrom(data: Map<string,any>): Category {
    return new Category({
      name: data.get(CategoryTypes.NAME),
      groupId: this.dataProvider.group
    })
  }

  async configuration() {
    this.dataGridConfig = new DataGridConfig([
      new DataGridItemText.Builder()
        .setKey(CategoryTypes.NAME)
        .setDisplay(this.translate.instant('containers.settings.categories.name'))
        .setTextProvider((t: Category): string => t.name)
        .setVisible(true)
        .build(),
    ]);

    this.addConfig = new AddItemConfig([
      new AddItemInput.Builder()
        .setKey(CategoryTypes.NAME)
        .setDisplay(this.translate.instant('containers.settings.categories.name'))
        .build()
    ]);
  }
}
