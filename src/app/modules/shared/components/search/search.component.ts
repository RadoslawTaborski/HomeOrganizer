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
    isLoaded = false;

    constructor(private translate: TranslateService) {
    }

    ngOnInit() {
        this.isLoaded=false;
        this.translate.get('modules.shared.components.search.clean').subscribe(t => {
            console.log("init", t)
            this.isLoaded = true;
        });
    }

    ngAfterViewInit(): void {
        this.isLoaded=false;
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
            this.translate.get('modules.shared.components.search.clean').subscribe(t => {
                console.log("after", t)
                this.isLoaded = true;
            });
    }

    ngOnChanges() {
        this.isLoaded=false;
        this.translate.get('modules.shared.components.search.clean').subscribe(t => {
            console.log("changes", t)
            this.isLoaded = true;
        });
    }

    ngOnDestroy(): void {
        this.isLoaded=false;
        this.translate.get('modules.shared.components.search.clean').subscribe(t => {
            console.log("destroy", t)
            this.isLoaded = true;
        });
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
