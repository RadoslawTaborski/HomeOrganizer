import { Component, OnInit } from '@angular/core';
import { ParametersService } from '../services/parameters.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  appName = ParametersService.AppName;

  constructor(private translate: TranslateService) { 
    this.translate.addLangs(["en","pl"]);
  }

  ngOnInit(): void {
    this.translate.get('root.header.shopping').subscribe(t=>{
      //console.log(t)
    })
  }

}
