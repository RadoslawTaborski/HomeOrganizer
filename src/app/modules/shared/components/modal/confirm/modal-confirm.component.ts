import { Component, Output, EventEmitter, Input } from '@angular/core';

import { ModalBase } from '../modal-base';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'modal-confirm',
    templateUrl: './modal-confirm.component.html'
})
export class ModalConfirmComponent extends ModalBase {
    @Input() question: string;
    @Input() btnText: string;
    @Output() outputAction = new EventEmitter<{result: ConfirmOption, details: string}>();

    constructor(modalService: NgbModal) {
        super(modalService);
    }

    go(result: string) {
        if(result.startsWith('Closed')){
            this.outputAction.emit({result: 'ok', details: result});
        } else {
            this.outputAction.emit({result: 'dissmised', details: result});
        }

    }
}

export type ConfirmOption = 'ok' | 'dissmised';
