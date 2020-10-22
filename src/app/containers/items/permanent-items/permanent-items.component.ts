import { Component, OnInit, ViewChild } from '@angular/core';
import { IPermanentItemModel, PermanentItemTypes, State, PermanentItemAction, PermanentItemsFilters, PermanentItemModel, PermanentItemsFilterTypes } from './services/permanent-item.service.models'
import { DataGridConfig, DataGridItemText, DataGridItemButton } from '../../../modules/shared/components/data-grid/data-grid-config';
import { StateService } from 'src/app/root/services/state.service';
import { Router } from '@angular/router';
import { BehaviorSubject, Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { SearchConfig, SearchControl, FieldTypes as SearchFieldTypes } from 'src/app/modules/shared/components/search/search-config';
import { SubCategory, Category } from '../models/models';
import { TranslateService } from '@ngx-translate/core';
import { AddItemConfig, AddItemInput, AddItemSelect } from 'src/app/modules/shared/components/modal/add/add-config';
import { DataProviderService } from '../../services/data-provider.service';
import { OperationsService } from '../utils/operations.service';
import { ConfirmOption } from 'src/app/modules/shared/components/modal/confirm/modal-confirm.component';
import { AddOption } from 'src/app/modules/shared/components/modal/add/add.component';
import { DateService } from 'src/app/modules/shared/utils/date/date.service';

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

  @ViewChild('confirmModal') confirmModal;
  toRemove: PermanentItemModel;

  constructor(
    private operationsService: OperationsService,
    private dataProvider: DataProviderService,
    private stateService: StateService,
    private translate: TranslateService,
    public dateService: DateService,
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
        new SearchControl(SearchFieldTypes.SELECT, PermanentItemsFilterTypes.CATEGORY, this.translate.instant('containers.items.category'), await this.operationsService.getCategories(), (t: Category) => t?.name, (t: Category) => t?.id),
        new SearchControl(SearchFieldTypes.SELECT, PermanentItemsFilterTypes.SUBCATEGORY, this.translate.instant('containers.items.subcategory'), await this.operationsService.getSubCategories(), (t: SubCategory) => t?.name, (t: SubCategory) => t?.id),
        new SearchControl(SearchFieldTypes.SELECT, PermanentItemsFilterTypes.STATE, this.translate.instant('containers.items.permanent-item.state'), await this.getStates(), (t: State) => this.translateState(t), (t: State) => t.id),
      ]);

      this.dataGridConfig = new DataGridConfig([
        new DataGridItemText.Builder()
          .setKey(PermanentItemTypes.NAME)
          .setDisplay(this.translate.instant('containers.items.name'))
          .setColumnClass("absorbing-column")
          .setVisible(true)
          .build(),
        new DataGridItemText.Builder()
          .setKey(PermanentItemTypes.CATEGORY)
          .setDisplay(this.translate.instant('containers.items.category'))
          .setTextProvider((t: IPermanentItemModel): string => t.category.parent.name)
          .build(),
        new DataGridItemText.Builder()
          .setKey(PermanentItemTypes.SUBCATEGORY)
          .setDisplay(this.translate.instant('containers.items.subcategory'))
          .setTextProvider((t: IPermanentItemModel): string => t.category.name)
          .build(),
        new DataGridItemText.Builder()
          .setKey(PermanentItemTypes.DATE)
          .setDisplay(this.translate.instant('containers.items.permanent-item.lastUpdate'))
          .setTextProvider((t: IPermanentItemModel): string => this.dateService.isoToLocal(t.updateTime))
          .build(),
          new DataGridItemButton.Builder()
          .setKey(PermanentItemTypes.STATE)
          .setDisplay(this.translate.instant('containers.items.permanent-item.state'))
          .setTextProvider(() => "")
          .setAccess(this.stateService.access)
          .setStyleProvider((t: IPermanentItemModel) => this.stateButtonStyleProvider(t))
          .setColumnClass("fitwidth")
          .setVisible(true)
          .build(),
        new DataGridItemButton.Builder()
          .setKey(PermanentItemTypes.ARCHIVE)
          .setDisplay(this.translate.instant('containers.items.delete'))
          .setIconProvider(()=>"<i class=\"fas fa-window-close\"></i>")
          .setClassProvider((t: IPermanentItemModel) => "btn btn-danger")
          .setAccess(this.stateService.access)
          .setColumnClass("fitwidth")
          .setVisible(true)
          .build(),
      ]);

      this.addConfig = new AddItemConfig([
        new AddItemInput(PermanentItemTypes.NAME, this.translate.instant('containers.items.name')),
        new AddItemSelect(PermanentItemTypes.SUBCATEGORY, this.translate.instant('containers.items.subcategory'), null, await this.operationsService.getSubCategories(), (t: SubCategory) => t?.name, (t: SubCategory) => t?.id),
      ]);

      this.filters = new BehaviorSubject(new PermanentItemsFilters());
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

  stateButtonStyleProvider(data: PermanentItemModel): string {
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

  async update(data: PermanentItemModel) {
    await this.changeState(data);
  }

  remove(data: PermanentItemModel) {
    this.toRemove = data;
    this.confirmModal.clickButton();
  }

  async removeAction(data: { result: ConfirmOption, details: string, object: PermanentItemModel }) {
    switch (data.result) {
      case 'ok':
        await this.dataProvider.removePermanentItem(data.object);
        window.location.reload();
        break;
      case 'dissmised': console.log('nok', data); break;
    }
  }

  async add(data: PermanentItemModel) {
    await this.dataProvider.addPermanentItem(data);
    window.location.reload();
  }

  async changeState(data: PermanentItemModel) {
    let states = this.getStates();
    let stateId = states.indexOf(data.state);
    let max = states.length;
    let newStateId = stateId - 1 >= 0 ? stateId - 1 : max - 1;
    data.state = states[newStateId]
    await this.dataProvider.updatePermanentItem(data);
  }

  async updateFilters(value?) {
    this.operationsService.updateFilters(this.category, this.subcategory, value);
    this.filters.next({ ...this.filters.value, ...value });
  }

  async fetchSubCategories() {
    this.operationsService.fetchSubCategories(this.category, this.subcategory);
  }

  async fetch() {
    await this.dataProvider.getPermanentItems(this.filters.getValue()).then(v => {
      this.items = v;
    })
  }

  async addItem(data: { result: AddOption, details: any }) {
    switch (data.result) {
      case 'ok':
        let item = new PermanentItemModel({
          name: data.details.name,
          category: this.dataProvider.subcategories.filter(i => i.id == data.details.subcategory)[0],
          state: this.dataProvider.states.filter(i => i.id == "3")[0],
          groupId: this.dataProvider.group
        })

        await this.add(item);

        break;
      case 'dissmised': console.log('nok', data); break;
    }
  }
}
