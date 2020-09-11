import { AfterViewInit, Component, Input, Output, ViewChild, OnDestroy, EventEmitter } from '@angular/core';
import { SearchControl, SearchControlModel } from './search-config';
import { Subscriber } from 'rxjs';
import { tap, filter } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-search',
    templateUrl: './search.component.html'
})

export class SearchComponent implements AfterViewInit, OnDestroy {

    @Input() controls: SearchControl[];
    @Output() searchChange = new EventEmitter();
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

    provideSelectText(item: SearchControlModel, model: any): string {
        return item.displayProvider(model)
    }

    provideSelectIdentifier(item: SearchControlModel, model: any) {
        return item?.identifierProvider(model)
    }
}
