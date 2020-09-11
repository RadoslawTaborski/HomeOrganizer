import { Component, OnInit } from '@angular/core';
import { ParametersService } from '../services/parameters.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'] 
})
export class FooterComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  getText():string{
    return ParametersService.FooterText;
  }

}
