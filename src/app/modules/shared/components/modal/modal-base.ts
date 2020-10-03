import { ModalDismissReasons, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TemplateRef } from "@angular/core";
import { NgForm, FormGroup } from '@angular/forms';

export interface ModalModel {
    open(content: TemplateRef<any>);
    checkAndSend?(form: NgForm | FormGroup): void;
    go(result: {}): void;
}

export class ModalBase implements ModalModel {

    openedModal: NgbModalRef;
    closeResult = '';

    constructor(private modalService) { }

    checkAndSend(form) {
        if (form.valid) {
            this.openedModal.close(form.value);
        } else {
            console.log('form invalid');
        }
    }

    open(content) {
        this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
            this.closeResult = `Closed with: ${result}`;
            this.go(this.closeResult);
        }, (reason) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
            this.go(this.closeResult);
        });
    }

    private getDismissReason(reason: any): string {
        if (reason === ModalDismissReasons.ESC) {
            return 'by pressing ESC';
        } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
            return 'by clicking on a backdrop';
        } else {
            return `with: ${reason}`;
        }
    }

    go(result: any) {
        throw new Error('you should override go method');
    }
}
