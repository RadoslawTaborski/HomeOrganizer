import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Data } from '@angular/router';
import { map } from 'rxjs/operators';
import { Location } from '@angular/common';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-details',
  templateUrl: './shopping-list-details.component.html',
  styleUrls: ['./shopping-list-details.component.scss']
})
export class ShoppingListDetailsComponent {
  
  data: Observable<Data>;

  constructor(
      private route: ActivatedRoute,
      private location: Location) {
      this.data = route.data.pipe(map(({ item }) => item));    
  }

  back() {
      this.location.back();
  }

}
