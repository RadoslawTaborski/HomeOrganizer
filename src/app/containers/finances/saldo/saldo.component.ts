import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { DataGridConfig, DataGridItemText } from 'src/app/modules/shared/components/data-grid/data-grid-config';
import { AddItemCheckboxes, AddItemConfig, AddItemInput, AddItemNumber, AddItemRadio, CheckboxPair } from 'src/app/modules/shared/components/modal/add/add-config';
import { AddOption } from 'src/app/modules/shared/components/modal/add/add.component';
import { ConfirmOption } from 'src/app/modules/shared/components/modal/confirm/modal-confirm.component';
import { SearchConfig } from 'src/app/modules/shared/components/search/search-config';
import { User } from '../../accounts/users/services/users.service.models';
import { DataProviderService } from '../../services/data-provider.service';
import { ExpenseDetail } from '../expense-details/services/expense-details.service.models';
import { Expense, ExpenseTypes } from '../expenses/services/expenses.service.models';
import { Saldo, SaldoAction, SaldoFilters, SaldoTypes } from './services/saldo.service.models';

@Component({
  selector: 'app-saldo',
  templateUrl: './saldo.component.html',
  styleUrls: ['./saldo.component.scss']
})
export class SaldoComponent implements OnInit {

  dataGridConfig: DataGridConfig;
  searchConfig: SearchConfig;
  addConfig: AddItemConfig;

  items: { data: Saldo[], total: number };
  filters: BehaviorSubject<SaldoFilters>;
  itemAction: Subject<SaldoAction>;
  filtersSubscriber: Subscription;
  itemActionSubscriber: Subscription;

  isLoaded: boolean = false;

  @ViewChild('confirmModal') confirmModal;
  toRemove: Saldo;

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
    this.translate.get('containers.finances.expenses.name').subscribe(async (t) => {
      await this.dataProvider.init();
      await this.dataProvider.reloadUsers();
      await this.dataProvider.reloadUsersSettings();
      //console.log(this.dataProvider.users);
      await this.configuration();

      this.filters = new BehaviorSubject(new SaldoFilters());
      this.itemAction = new Subject();

      this.filtersSubscriber = this.filters
        .pipe(debounceTime(500))
        .subscribe(async () => await this.fetch());

      this.itemActionSubscriber = this.itemAction
        .subscribe((action) => {
          switch (action.type) {
            case 'add': this.add(action.data); break;
          }
        });

      this.isLoaded = true;
    });
  }

  updateSearchConfig() {
    return this.searchConfig?.controls;
  }

  remove(data: Saldo) {
    this.toRemove = data;
    this.confirmModal.clickButton();
  }

  async removeAction(data: { result: ConfirmOption, details: string, object: Saldo }) {
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
        if (obj)
          this.add(obj);
        break;
      case 'dissmised': console.log('nok', data); break;
    }
  }

  async removeItem(data: Saldo) {
    console.log("remove");
    window.location.reload();
  }

  async add(data: Expense) {
    await this.dataProvider.addExpense(data);
    window.location.reload();
  }

  async fetch() {
    await this.dataProvider.getSaldos(this.filters.getValue()).then(v => {
      this.items = v;
    })
  }

  async more(data: Saldo) {
    console.log("more");
  }

  async update(data: Saldo) {
    console.log("update");
  }

  createFrom(data: Map<string, any>): Expense {
    let recipient = data.get(ExpenseTypes.RECIPIENTS);
    let payer = data.get(ExpenseTypes.PAYER);
    let amount = data.get(ExpenseTypes.AMOUNT);
    if (payer == null || recipient == null) {
      return null;
    }
    let details: ExpenseDetail[] = []
    details.push(new ExpenseDetail({
      payer: this.dataProvider.users.filter(u => u.id == payer)[0],
      recipient: this.dataProvider.usersSettings.filter(u => u.user.id == recipient)[0],
      value: amount
    }))

    let result = new Expense({
      name: this.translate.instant('containers.finances.saldo.debtRepayment'),
      groupId: this.dataProvider.group.id,
    })

    result.details = details;

    return result;
  }

  async configuration() {
    this.dataGridConfig = new DataGridConfig([
      new DataGridItemText.Builder()
        .setKey(SaldoTypes.RECIPIENT)
        .setDisplay(this.translate.instant('containers.finances.saldo.person1'))
        .setTextProvider((t: Saldo): string => this.translate.instant('containers.finances.saldo.user') + ": " + t.recipient.username)
        .setVisible(true)
        .build(),
      new DataGridItemText.Builder()
        .setKey(SaldoTypes.PAYER)
        .setDisplay(this.translate.instant('containers.finances.saldo.person2'))
        .setTextProvider((t: Saldo): string => this.translate.instant('containers.finances.saldo.indebt') + ": " + t.payer.username)
        .setVisible(true)
        .build(),
      new DataGridItemText.Builder()
        .setKey(SaldoTypes.VALUE)
        .setDisplay(this.translate.instant('containers.finances.saldo.amount'))
        .setTextProvider((t: Saldo): string => this.translate.instant('containers.finances.saldo.amount') + ": " + t.value.toFixed(2).toString() + ' zł')
        .setColumnClass("fitwidth")
        .setVisible(true)
        .build()
    ]);

    this.addConfig = new AddItemConfig([
      new AddItemNumber.Builder()
        .setKey(ExpenseTypes.AMOUNT)
        .setStep(0.01)
        .setDefault(0.00)
        .setDisplay(this.translate.instant('containers.finances.saldo.amount'))
        .build(),
      new AddItemRadio.Builder()
        .setKey(ExpenseTypes.PAYER)
        .setDisplay(this.translate.instant('containers.finances.saldo.repayer'))
        .setOptions(this.dataProvider.users)
        .setValue(this.dataProvider.users[0])
        .setDisplayProvider((t: User) => t?.username)
        .setIdentifierProvider((t: User) => t?.id)
        .build(),
      new AddItemRadio.Builder()
        .setKey(ExpenseTypes.RECIPIENTS)
        .setDisplay(this.translate.instant('containers.finances.saldo.toWhom'))
        .setOptions(this.dataProvider.users)
        .setValue(this.dataProvider.users[0])
        .setDisplayProvider((t: User) => t?.username)
        .setIdentifierProvider((t: User) => t?.id)
        .build()
    ]);
  }
}
