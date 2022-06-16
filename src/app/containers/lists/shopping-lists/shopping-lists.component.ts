import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Subject, Subscription } from 'rxjs';
import { DataGridConfig, DataGridItemButton, DataGridItemCheckbox, DataGridItemText } from 'src/app/modules/shared/components/data-grid/data-grid-config';
import { AddItemConfig, AddItemInput, AddItemSelect } from 'src/app/modules/shared/components/modal/add/add-config';
import { ShoppingListAction, IShoppingListModel, ShoppingListsTypes, ShoppingListModel, ShoppingListsFilters, ShoppingListsFilterTypes } from './services/shopping-lists.service.models'
import { debounceTime } from 'rxjs/operators';
import { StateService } from 'src/app/root/services/state.service';
import { ConfirmOption } from 'src/app/modules/shared/components/modal/confirm/modal-confirm.component';
import { DataProviderService } from '../../services/data-provider.service';
import { DateService } from '../../../modules/shared/utils/date/date.service'
import { AddOption } from 'src/app/modules/shared/components/modal/add/add.component';
import { ListCategory } from '../../settings/listcategories/services/listcategories.service.models';
import { SearchConfig, SearchSelect } from 'src/app/modules/shared/components/search/search-config';
import { OperationsService } from '../../services/operations.service';

@Component({
  selector: 'app-shopping-lists',
  templateUrl: './shopping-lists.component.html',
  styleUrls: ['./shopping-lists.component.scss']
})
export class ShoppingListsComponent implements OnInit {

  dataGridConfig: DataGridConfig;
  searchConfig: SearchConfig;
  addConfig: AddItemConfig;

  lists: { data: IShoppingListModel[], total: number };
  listAction: Subject<ShoppingListAction>;
  listActionSubscriber: Subscription;

  filters: BehaviorSubject<ShoppingListsFilters>;
  filtersSubscriber: Subscription;

  isLoaded: boolean = false;
  toRemove: ShoppingListModel;

  @ViewChild('confirmModal') confirmModal;

  constructor(
    private operationsService: OperationsService,
    private translate: TranslateService,
    private dataProvider: DataProviderService,
    public stateService: StateService,
    public dateService: DateService,
    public router: Router
  ) { }

  ngOnDestroy(): void {
    this.listActionSubscriber.unsubscribe();
  }

  async ngOnInit(): Promise<void> {
    await this.dataProvider.init();
    await this.dataProvider.reloadCategories();
    await this.dataProvider.reloadSubCategories();
    await this.dataProvider.reloadStates();

    this.translate.get('containers.items.name').subscribe(async (t) => {
      let categories = this.dataProvider.listcategories;
      this.searchConfig = new SearchConfig([
        new SearchSelect.Builder()
        .setKey(ShoppingListsFilterTypes.CATEGORY)
        .setDisplay(this.translate.instant('containers.lists.category'))
        .setOptions(await this.operationsService.getListCategories())
        .setDisplayProvider((t: ListCategory) => this.translateListCategory(t))
        .setIdentifierProvider((t: ListCategory) => t?.id)
        .build()
      ]);

      this.dataGridConfig = new DataGridConfig([
        new DataGridItemCheckbox.Builder()
          .setKey(ShoppingListsTypes.VISIBLE)
          .setDisplay(this.translate.instant('containers.lists.visible'))
          .setValueProvider((t: ShoppingListModel) => t.visible)
          .setColumnClass("exactValue")
          .setColumnStyle("--value: 40px;")
          .setEditable((t: ShoppingListModel)=>this.editable(t))
          .setVisible(true)
          .build(),
        new DataGridItemText.Builder()
          .setKey(ShoppingListsTypes.NAME)
          .setDisplay(this.translate.instant('containers.lists.name'))
          .setTextProvider((t:ShoppingListModel) => this.translateList(t))
          .setColumnClass("absorbing-column")
          .setVisible(true)
          .build(),
        new DataGridItemButton.Builder()
          .setKey(ShoppingListsTypes.MORE)
          .setDisplay(this.translate.instant('containers.lists.more'))
          .setIconProvider(() => "<i class=\"fas fa-info\"></i>")
          .setClassProvider((t: ShoppingListModel) => "btn btn-primary")
          .setAccess(this.stateService.access)
          .setColumnClass("fitwidth")
          .setVisible(true)
          .build(),
        new DataGridItemButton.Builder()
          .setKey(ShoppingListsTypes.ARCHIVE)
          .setDisplay(this.translate.instant('containers.lists.delete'))
          .setIconProvider(() => "<i class=\"fas fa-window-close\"></i>")
          .setClassProvider((t: ShoppingListModel) => "btn btn-danger")
          .setAccess(this.stateService.access)
          .setColumnClass("fitwidth")
          .setEditable((t: ShoppingListModel)=>this.editable(t))
          .setVisible(true)
          .build(),
        new DataGridItemText.Builder()
          .setKey(ShoppingListsTypes.DESCRIPTION)
          .setDisplay(this.translate.instant('containers.lists.description'))
          .setTextProvider((t:ShoppingListModel) => this.translateListDescription(t))
          .build(),
        new DataGridItemText.Builder()
          .setKey(ShoppingListsTypes.CATEGORY)
          .setDisplay(this.translate.instant('containers.lists.category'))
          .setTextProvider((t:ShoppingListModel) => this.translateListCategory(t.category))
          .build(),
        new DataGridItemText.Builder()
          .setKey(ShoppingListsTypes.CREATED)
          .setDisplay(this.translate.instant('containers.lists.created'))
          .setTextProvider((t: ShoppingListModel) => this.dateService.isoToLocal(t.createTime))
          .build(),
        new DataGridItemText.Builder()
          .setKey(ShoppingListsTypes.UPDATED)
          .setDisplay(this.translate.instant('containers.lists.updated'))
          .setTextProvider((t: ShoppingListModel) => this.dateService.isoToLocal(t.updateTime))
          .build(),
      ]);

      this.addConfig = new AddItemConfig([
        new AddItemInput.Builder()
          .setKey(ShoppingListsTypes.NAME)
          .setDisplay(this.translate.instant('containers.lists.name'))
          .build(),
        new AddItemSelect.Builder()
          .setKey(ShoppingListsTypes.CATEGORY)
          .setDisplay(this.translate.instant('containers.lists.category'))
          .setOptions(this.dataProvider.listcategories)
          .setDisplayProvider((t: ListCategory) => this.translateListCategory(t))
          .setIdentifierProvider((t: ListCategory) => t?.id)
          .setValue(this.dataProvider.listcategories.filter(i=>i.name=="none")[0].id)
          .build(),
        new AddItemInput.Builder()
          .setKey(ShoppingListsTypes.DESCRIPTION)
          .setDisplay(this.translate.instant('containers.lists.description'))
          .build(),
      ]);

      this.filters = new BehaviorSubject(new ShoppingListsFilters());
      this.listAction = new Subject();

      this.filtersSubscriber = this.filters
        .pipe(debounceTime(500))
        .subscribe(() => this.fetch());

      this.listActionSubscriber = this.listAction
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

  translateListDescription(t: ShoppingListModel) {
    if(!t.description){
      return "";
    }
    if(t.description == "GROUP_ONE_TIME"){
      return this.translate.instant('containers.lists.one-time-list')
    }
    return this.parseBody(t.description);
  }

  translateListCategory(t: ListCategory): string {
    if(!t){
      return "";
    }
    if(t.name == "none"){
      return this.translate.instant('containers.settings.listcategories.none');
    }
    return t.name;
  }

  editable(t: ShoppingListModel) {
    if(!t){
      return true;
    }
    if(t.name == "GROUP_ONE_TIME"){
      return false;
    }
    return true;
  }

  translateList(t: ShoppingListModel) {
    if(!t.name){
      return "";
    }
    if(t.name == "GROUP_ONE_TIME"){
      return this.translate.instant('containers.lists.one-time-list')
    }
    return t.name;
  }

  parseBody(body:string) : string {
    return body.replace(/((http|https).*)/, "<a href=\"$1\">link</a>")
  }

  updateSearchConfig() {
    return this.searchConfig?.controls;
  }

  more(data: ShoppingListModel) {
    this.router.navigate(['shopping-lists/' + data.id]);
  }

  async update(data: ShoppingListModel) {
    data.visible = !data.visible;
    await this.dataProvider.updateShoppingList(data);
  }

  async updateFilters(value?) {
    this.filters.next({ ...this.filters.value, ...value });
  }

  remove(data: ShoppingListModel) {
    this.toRemove = data;
    this.confirmModal.clickButton();
  }

  async removeAction(data: { result: ConfirmOption, details: string, object: ShoppingListModel }) {
    switch (data.result) {
      case 'ok':
        await this.dataProvider.removeShoppingList(data.object);
        this.ngOnInit();
        break;
      case 'dissmised': console.log('nok', data); break;
    }
  }

  async add(data: ShoppingListModel) {
    await this.dataProvider.addShoppingList(data);
    this.ngOnInit();
  }

  async fetch() {
    await this.dataProvider.getShoppingLists(this.filters.getValue()).then(v => {
      this.lists = v;
      var first = "GROUP_ONE_TIME";
      this.lists.data.sort(function(x,y){ return x.name == first ? -1 : y.name == first ? 1 : 0; });
    })
  }

  async addItem(data: { result: AddOption, details: Map<string,any> }) {
    switch (data.result) {
      case 'ok':
        let item = new ShoppingListModel({
          name: data.details.get(ShoppingListsTypes.NAME),
          description: data.details.get(ShoppingListsTypes.DESCRIPTION),
          category: this.dataProvider.listcategories.filter(i => i.id == data.details.get(ShoppingListsTypes.CATEGORY))[0],
          visible: true,
          groupId: this.dataProvider.group.id
        })

        await this.add(item);

        break;
      case 'dissmised': console.log('nok', data); break;
    }
  }

}
