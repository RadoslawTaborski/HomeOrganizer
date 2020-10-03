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
        new DataGridItemCheckbox(ShoppingListsTypes.VISIBLE, this.translate.instant('containers.lists.visible'), null, (t: ShoppingListModel)=>t.visible, "10%", true),
        new DataGridItemText(ShoppingListsTypes.NAME, this.translate.instant('containers.lists.name'), null, "65%", true),
        new DataGridItemButton(ShoppingListsTypes.MORE, this.translate.instant('containers.lists.more'), () => this.translate.instant('containers.lists.more'), this.stateService.access, null, "25%", true),
        new DataGridItemButton(ShoppingListsTypes.ARCHIVE, this.translate.instant('containers.lists.delete'), () => this.translate.instant('containers.lists.delete'), this.stateService.access, null, "25%", true),
        new DataGridItemText(ShoppingListsTypes.DESCRIPTION, this.translate.instant('containers.lists.description'), (t: ShoppingListModel)=>t.description),
        new DataGridItemText(ShoppingListsTypes.CREATED, this.translate.instant('containers.lists.created'), (t: ShoppingListModel)=>this.dateService.isoToLocal(t.createTime)),
        new DataGridItemText(ShoppingListsTypes.UPDATED, this.translate.instant('containers.lists.updated'), (t: ShoppingListModel)=>this.dateService.isoToLocal(t.updateTime)),
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

  removeAction(data: {result: ConfirmOption, details: string}){
    switch(data.result){
      case 'ok': console.log('removed', data); break;
      case 'dissmised': console.log('nok', data); break;
    }   
  }

  more(data: ShoppingListModel) {
    this.router.navigate(['shopping-lists/' + data.id]);
  }

  async update(data: ShoppingListModel) {
    data.visible = !data.visible;
    await this.dataProvider.updateShoppingList(data);
    window.location.reload();
  }

  async remove(data: ShoppingListModel) {
    await this.dataProvider.removeShoppingList(data);
    window.location.reload();
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

  async addItem(data: any) {
    let item = new ShoppingListModel({
      name: data.name,
      description: data.description,
      visible: true
    })

    await this.add(item);
  }

}
