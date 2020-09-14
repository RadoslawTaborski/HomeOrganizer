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
  _opened: boolean = false;
 
  _toggleSidebar() {
    this._opened = !this._opened;
  }

  constructor() { }

  ngOnInit(): void {
  }

  action(data: {result: ConfirmOption, details: string}){
    switch(data.result){
      case 'ok': console.log('ok', data); break;
      case 'dissmised': console.log('nok', data); break;
    }
    
  }

  openNav(){
    document.getElementById("mySidebar").style.width = "250px";
    document.getElementById("main").style.marginLeft = "250px";
  }
  
  closeNav() {
    document.getElementById("mySidebar").style.width = "0";
    document.getElementById("main").style.marginLeft = "0";
  }
}