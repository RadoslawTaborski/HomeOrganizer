import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Subject, Subscription } from 'rxjs';
import { DataGridConfig, DataGridItemButton, DataGridItemText } from 'src/app/modules/shared/components/data-grid/data-grid-config';
import { AddItemConfig, AddItemInput } from 'src/app/modules/shared/components/modal/add/add-config';
import { ShoppingListAction, IShoppingListModel, ShoppingListsTypes, ShoppingListModel, ShoppingListsFilters } from './services/shopping-lists.service.models'
import { ShoppingListsService } from './services/shopping-lists.service'
import { debounceTime } from 'rxjs/operators';
import { StateService } from 'src/app/root/services/state.service';

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

  constructor(
    private translate: TranslateService,
    private listsService: ShoppingListsService,
    public stateService: StateService,
    public router: Router
  ) { }

  ngOnDestroy(): void {
    this.listActionSubscriber.unsubscribe();
  }

  ngOnInit(): void {
    this.translate.get('containers.items.name').subscribe(async (t) => {

      this.dataGridConfig = new DataGridConfig([
        new DataGridItemText(ShoppingListsTypes.NAME, this.translate.instant('containers.lists.name'), null, "75%", true),
        new DataGridItemButton(ShoppingListsTypes.MORE, this.translate.instant('containers.lists.more'), () => this.translate.instant('containers.lists.more'), this.stateService.access, null, "25%", true),
        new DataGridItemButton(ShoppingListsTypes.ARCHIVE, this.translate.instant('containers.lists.delete'), () => this.translate.instant('containers.lists.delete'), this.stateService.access, null, "25%", true),
        new DataGridItemText(ShoppingListsTypes.CREATED, this.translate.instant('containers.items.name'), null),
        new DataGridItemText(ShoppingListsTypes.UPDATED, this.translate.instant('containers.items.name'), null,),
      ]);

      this.addConfig = new AddItemConfig([
        new AddItemInput(ShoppingListsTypes.NAME, this.translate.instant('containers.items.name')),
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

  update(data: ShoppingListModel) {
    console.log("update");
  }

  remove(data: ShoppingListModel) {
    if(confirm(this.translate.instant('containers.lists.confirm'))){
      console.log('removed')
    }
  }

  add(data: ShoppingListModel) {
    console.log("add");
  }

  addItem(data: any){
    console.log(data)
  }

  async fetch() {
    await this.listsService.fetch(this.filters.getValue()).then(v => {
      this.lists = v;
    })
  }

}
