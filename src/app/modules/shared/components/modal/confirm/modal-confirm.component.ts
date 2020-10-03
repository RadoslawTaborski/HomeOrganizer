import { Component, Output, EventEmitter, Input, ElementRef, ViewChild } from '@angular/core';

import { ModalBase } from '../modal-base';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'modal-confirm',
    templateUrl: './modal-confirm.component.html'
})
export class ModalConfirmComponent extends ModalBase {
    @Input() question: string;
    @Input() btnText: string;
    @Input() displayButton: boolean;
    @Input() object: any
    @Output() outputAction = new EventEmitter<{ result: ConfirmOption, details: string, object: any }>();

    @ViewChild('openBtn') openBtn: ElementRef;

    constructor(modalService: NgbModal) {
        super(modalService);
    }

    go(result: string) {
        if (result.startsWith('Closed')) {
            this.outputAction.emit({ result: 'ok', details: result, object: this.object });
        } else {
            this.outputAction.emit({ result: 'dissmised', details: result, object: null });
        }

    }

    public clickButton() {
        this.openBtn.nativeElement.click();
    }
}

export type ConfirmOption = 'ok' | 'dissmised';
