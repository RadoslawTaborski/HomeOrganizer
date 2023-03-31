import { AfterViewInit, Component, Input, Output, ViewChild, OnDestroy, EventEmitter } from '@angular/core';
import { SearchSelect, SearchItemModel, SearchSelectModel } from './search-config';
import { Subscriber } from 'rxjs';
import { tap, filter } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})

export class SearchComponent implements AfterViewInit, OnDestroy {

  @Input() controls: SearchSelect[];
  @Output() searchChange = new EventEmitter();
  @Output() closeEvent = new EventEmitter();
  @ViewChild('searchForm', { static: true }) searchForm;
  formInitValue: {};
  formSubscriber: Subscriber<any>;

  constructor(private translate: TranslateService) {
  }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    this.formSubscriber = this.searchForm
      .valueChanges
      .pipe(
        tap((value: { [key: string]: any }) => {
          if (!this.formInitValue && Object.keys(value).length === this.controls.length) {
            this.formInitValue = { ...value };
          }
        }),
        filter(_ => !this.searchForm.pristine)
      )
      .subscribe((value) => this.searchChange.emit(value));
  }

  ngOnChanges() {
  }

  ngOnDestroy(): void {
    this.formSubscriber.unsubscribe();
  }

  clear() {
    this.searchForm.setValue(this.formInitValue);
  }

  close() {
    this.closeEvent.emit();
  }

  provideSelectText(item: SearchItemModel, model: any): string {
    return this.castToSelect(item).displayProvider(model)
  }

  provideSelectIdentifier(item: SearchItemModel, model: any) {
    return this.castToSelect(item)?.identifierProvider(model)
  }

  castToSelect(item: SearchItemModel): SearchSelectModel {
    return item as SearchSelectModel;
  }
}
