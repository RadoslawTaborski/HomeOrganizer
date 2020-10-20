import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Subject, Subscription } from 'rxjs';
import { DataGridConfig, DataGridItemButton, DataGridItemCheckbox, DataGridItemText } from 'src/app/modules/shared/components/data-grid/data-grid-config';
import { AddItemConfig, AddItemInput } from 'src/app/modules/shared/components/modal/add/add-config';
import { ShoppingListAction, IShoppingListModel, ShoppingListsTypes, ShoppingListModel, ShoppingListsFilters } from './services/shopping-lists.service.models'
import { debounceTime } from 'rxjs/operators';
import { StateService } from 'src/app/root/services/state.service';
import { ConfirmOption } from 'src/app/modules/shared/components/modal/confirm/modal-confirm.component';
import { DataProviderService } from '../../services/data-provider.service';
import { DateService } from '../../../modules/shared/utils/date/date.service'
import { AddOption } from 'src/app/modules/shared/components/modal/add/add.component';

@Component({
  selector: 'app-shopping-lists',
  templateUrl: './shopping-lists.component.html',
  styleUrls: ['./shopping-lists.component.scss']
})
export class ShoppingListsComponent implements OnInit {

  dataGridConfig: DataGridConfig;
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
    await this.dataProvider.reloadSubCategories();
    await this.dataProvider.reloadStates();
    
    this.translate.get('containers.items.name').subscribe(async (t) => {

      this.dataGridConfig = new DataGridConfig([
        new DataGridItemCheckbox.Builder()
        .setKey(ShoppingListsTypes.VISIBLE)
        .setDisplay(this.translate.instant('containers.lists.visible'))
        .setValueProvider((t: ShoppingListModel)=>t.visible)
        .setColumnClass("exactValue")
        .setColumnStyle("--value: 40px;")
        .setVisible(true)
        .build(),
        new DataGridItemText.Builder()
        .setKey(ShoppingListsTypes.NAME)
        .setDisplay(this.translate.instant('containers.lists.name'))
        .setColumnClass("absorbing-column")
        .setVisible(true)
        .build(),
        new DataGridItemButton.Builder()
        .setKey(ShoppingListsTypes.MORE)
        .setDisplay(this.translate.instant('containers.lists.more'))
        .setIconProvider(()=>"<i class=\"fas fa-info\"></i>")
        .setClassProvider((t: ShoppingListModel) => "btn btn-primary")
        .setAccess(this.stateService.access)
        .setColumnClass("fitwidth")
        .setVisible(true)
        .build(),
        new DataGridItemButton.Builder()
        .setKey(ShoppingListsTypes.ARCHIVE)
        .setDisplay(this.translate.instant('containers.lists.delete'))
        .setIconProvider(()=>"<i class=\"fas fa-window-close\"></i>")
        .setClassProvider((t: ShoppingListModel) => "btn btn-danger")
        .setAccess(this.stateService.access)
        .setColumnClass("fitwidth")
        .setVisible(true)
        .build(),
        new DataGridItemText.Builder()
        .setKey(ShoppingListsTypes.DESCRIPTION)
        .setDisplay(this.translate.instant('containers.lists.description'))
        .setTextProvider((t: ShoppingListModel)=>t.description)
        .build(),
        new DataGridItemText.Builder()
        .setKey(ShoppingListsTypes.CREATED)
        .setDisplay(this.translate.instant('containers.lists.created'))
        .setTextProvider((t: ShoppingListModel)=>this.dateService.isoToLocal(t.createTime))
        .build(),
        new DataGridItemText.Builder()
        .setKey(ShoppingListsTypes.UPDATED)
        .setDisplay(this.translate.instant('containers.lists.updated'))
        .setTextProvider((t: ShoppingListModel)=>this.dateService.isoToLocal(t.updateTime))
        .build(),
      ]);

      this.addConfig = new AddItemConfig([
        new AddItemInput(ShoppingListsTypes.NAME, this.translate.instant('containers.lists.name')),
        new AddItemInput(ShoppingListsTypes.DESCRIPTION, this.translate.instant('containers.lists.description')),
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

  more(data: ShoppingListModel) {
    this.router.navigate(['shopping-lists/' + data.id]);
  }

  async update(data: ShoppingListModel) {
    data.visible = !data.visible;
    await this.dataProvider.updateShoppingList(data);
    window.location.reload();
  }

  remove(data: ShoppingListModel) {
    this.toRemove = data;
    this.confirmModal.clickButton();
  }

  async removeAction(data: { result: ConfirmOption, details: string, object: ShoppingListModel }) {
    switch (data.result) {
      case 'ok':
        await this.dataProvider.removeShoppingList(data.object);
        window.location.reload();
        break;
      case 'dissmised': console.log('nok', data); break;
    }
  }

  async add(data: ShoppingListModel) {
    await this.dataProvider.addShoppingList(data);
    window.location.reload();
  }

  async fetch() {
    await this.dataProvider.getShoppingLists(this.filters.getValue()).then(v => {
      this.lists = v;
    })
  }

  async addItem(data: { result: AddOption, details: any}) {
    switch (data.result) {
      case 'ok':
        let item = new ShoppingListModel({
          name: data.details.name,
          description: data.details.description,
          visible: true
        })
    
        await this.add(item);

        break;
      case 'dissmised': console.log('nok', data); break;
    }
  }

}
