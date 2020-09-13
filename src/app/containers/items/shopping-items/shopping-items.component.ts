import { Component, OnInit } from '@angular/core';
import { ConfirmOption } from 'src/app/modules/shared/components/modal/confirm/modal-confirm.component';

@Component({
  selector: 'app-shopping-items',
  templateUrl: './shopping-items.component.html',
  styleUrls: ['./shopping-items.component.scss']
})
export class ShoppingItemsComponent implements OnInit {

  question: string = "Hallu?"
  btnText: string = "Open"

  constructor() { }

  ngOnInit(): void {
  }

  action(data: {result: ConfirmOption, details: string}){
    switch(data.result){
      case 'ok': console.log('ok', data); break;
      case 'dissmised': console.log('nok', data); break;
    }
    
  }
}
