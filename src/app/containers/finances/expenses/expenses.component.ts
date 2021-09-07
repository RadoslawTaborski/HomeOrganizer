import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { DataGridConfig, DataGridItemList, DataGridItemText } from 'src/app/modules/shared/components/data-grid/data-grid-config';
import { AddItemCheckbox, AddItemCheckboxes, AddItemConfig, AddItemInput, AddItemNumber, AddItemRadio, CheckboxPair } from 'src/app/modules/shared/components/modal/add/add-config';
import { AddOption } from 'src/app/modules/shared/components/modal/add/add.component';
import { ConfirmOption } from 'src/app/modules/shared/components/modal/confirm/modal-confirm.component';
import { SearchConfig } from 'src/app/modules/shared/components/search/search-config';
import { DateService } from 'src/app/modules/shared/utils/date/date.service';
import { User } from '../../accounts/users/services/users.service.models';
import { DataProviderService } from '../../services/data-provider.service';
import { ExpenseDetail } from '../expense-details/services/expense-details.service.models';
import { ExpensesFilters, Expense, ExpenseAction, ExpenseTypes } from './services/expenses.service.models';

@Component({
  selector: 'app-expenses',
  templateUrl: './expenses.component.html',
  styleUrls: ['./expenses.component.scss']
})
export class ExpensesComponent implements OnInit {

  dataGridConfig: DataGridConfig;
  searchConfig: SearchConfig;
  addConfig: AddItemConfig;

  items: { data: Expense[], total: number };
  filters: BehaviorSubject<ExpensesFilters>;
  itemAction: Subject<ExpenseAction>;
  filtersSubscriber: Subscription;
  itemActionSubscriber: Subscription;

  isLoaded: boolean = false;

  @ViewChild('confirmModal') confirmModal;
  toRemove: Expense;

  constructor(
    private dataProvider: DataProviderService,
    private translate: TranslateService,
    public dateService: DateService,
    public router: Router) {
  }

  ngOnDestroy(): void {
    this.filtersSubscriber.unsubscribe();
    this.itemActionSubscriber.unsubscribe();
  }

  async ngOnInit() {
    await this.translate.get('containers.finances.expenses.name').subscribe(async t => {
      await this.dataProvider.init();
      await this.dataProvider.reloadUsers();
      await this.dataProvider.reloadUsersSettings();
      await this.configuration();

      this.filters = new BehaviorSubject(new ExpensesFilters());
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

  remove(data: Expense) {
    this.toRemove = data;
    this.confirmModal.clickButton();
  }

  async removeAction(data: { result: ConfirmOption, details: string, object: Expense }) {
    switch (data.result) {
      case 'ok':
        await this.removeItem(data.object);
        break;
      case 'dissmised': console.log('nok', data); break;
    }
  }

  async addItem(data: { result: AddOption, details: Map<string, any> }) {
    switch (data.result) {
      case 'ok':
        let obj = this.createFrom(data.details);
        if(obj)
          this.add(obj);
        break;
      case 'dissmised': console.log('nok', data); break;
    }
  }

  async removeItem(data: Expense){
    console.log("remove");
    this.ngOnInit();
  }

  async add(data: Expense) {
    await this.dataProvider.addExpense(data);
    this.ngOnInit();
  }

  async fetch() {
    await this.dataProvider.getExpenses(this.filters.getValue()).then(v => {
      this.items = v;
    })
  }

  async more(data: Expense) {
    console.log("more");
  }

  async update(data: Expense) {
    console.log("update");
  }

  createFrom(data: Map<string, any>) : Expense {
    let recipientsGuids: string[] = data.get(ExpenseTypes.RECIPIENTS);
    let recipients = recipientsGuids.map(s=>this.dataProvider.usersSettings.filter(u=>u.user.id==s)[0])
    let payer = data.get(ExpenseTypes.PAYER);
    let amount = data.get(ExpenseTypes.AMOUNT);
    let fiftyfifty = data.get(ExpenseTypes.FIFTY_FIFTY);
    let coefficient = recipients.map(c=>c.value).reduce((prev, next) => prev + next)
    if(payer == null || recipients.length == 0){
      return null;
    }

    let details: ExpenseDetail[]=[]
    for(var recipient of recipients){
      details.push(new ExpenseDetail({
        payer: this.dataProvider.users.filter(u=>u.id==payer)[0],
        recipient: recipient,
        value: fiftyfifty? amount/recipients.length :amount * recipient.value / coefficient
      }))
    }

    let result = new Expense({
      name: data.get(ExpenseTypes.NAME),
      groupId: this.dataProvider.group.id,
    })

    result.details = details;

    return result;
  }

  async updateFilters(value?) {
    this.filters.next({ ...this.filters.value, ...value });
  }

  async configuration(){
    this.dataGridConfig = new DataGridConfig([
      new DataGridItemText.Builder()
      .setKey(ExpenseTypes.NAME)
      .setDisplay(this.translate.instant('containers.finances.expenses.name'))
      .setTextProvider((t: Expense): string => t.name)
      .setVisible(true)
      .build(),
      new DataGridItemText.Builder()
      .setKey(ExpenseTypes.VALUE)
      .setDisplay(this.translate.instant('containers.finances.expenses.amount'))
      .setTextProvider((t: Expense): string => t.calculateTotalValue().toFixed(2).toString()+" zł")
      .setColumnClass("fitwidth")
      .setVisible(true)
      .build(),
      new DataGridItemText.Builder()
      .setKey(ExpenseTypes.DATE)
      .setDisplay(this.translate.instant('containers.finances.expenses.date'))
      .setTextProvider((t: Expense): string => this.dateService.isoToLocal(t.createTime))
      .build(),
      new DataGridItemText.Builder()
      .setKey(ExpenseTypes.PAYER)
      .setDisplay(this.translate.instant('containers.finances.expenses.payer'))
      .setTextProvider((t: Expense): string => t.details[0].payer.username)
      .build(),
      new DataGridItemList.Builder()
      .setValuesProvider((t:Expense): ExpenseDetail[] => t.details)
      .setValueTextProvider((t:ExpenseDetail)=>`${t.recipient.user.username}: ${t.value.toFixed(2)} zł`)
      .build()
    ]);

    this.addConfig = new AddItemConfig([
      new AddItemInput.Builder()
      .setKey(ExpenseTypes.NAME)
      .setDisplay(this.translate.instant('containers.finances.expenses.name'))
      .build(),
      new AddItemNumber.Builder()
      .setKey(ExpenseTypes.AMOUNT)
      .setStep(0.01)
      .setDefault(0.00)
      .setDisplay(this.translate.instant('containers.finances.expenses.amount'))
      .build(),
      new AddItemRadio.Builder()
      .setKey(ExpenseTypes.PAYER)
      .setDisplay(this.translate.instant('containers.finances.expenses.payer'))
      .setOptions(this.dataProvider.users)
      .setValue(this.dataProvider.users.filter(u=>u.id==this.dataProvider.user.id)[0])
      .setDisplayProvider((t: User) => t?.username)
      .setIdentifierProvider((t: User) => t?.id)
      .build(),
      new AddItemCheckbox.Builder()
      .setKey(ExpenseTypes.FIFTY_FIFTY)
      .setValue(false)
      .setDisplayProvider(() => this.translate.instant('containers.finances.expenses.fifty-fifty'))
      .build(),
      new AddItemCheckboxes.Builder()
      .setKey(ExpenseTypes.RECIPIENTS)
      .setDisplay(this.translate.instant('containers.finances.expenses.contributors'))
      .setOptions(this.dataProvider.users.map(u=>new CheckboxPair(u, true)))
      .setDisplayProvider((t: User) => t?.username)
      .setIdentifierProvider((t: User) => t?.id)
      .build()
    ]);
  }
}
