import { Component, OnDestroy, OnInit } from '@angular/core';
import { ParametersService } from '../services/parameters.service';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/modules/shared/services/authentication/auth.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {

  appName = ParametersService.AppName;
  userName: string;
  isAuthenticated: boolean;
  subscription:Subscription;

  constructor(private translate: TranslateService, private authService: AuthService, private router: Router) { 
    this.translate.addLangs(["en","pl"]);
  }

  ngOnInit(): void {
    this.translate.get('root.header.shopping').subscribe(t=>{
      this.subscription = this.authService.authNavStatus$.subscribe(status => {
        this.isAuthenticated = status
        this.userName = this.authService.name;
      });
    })
  }

  ngOnDestroy() {
    if(this.subscription!=null){
      this.subscription.unsubscribe();
    }
  }

  login(){
    console.log("login")
    this.authService.login();
  }

  async signout() {
    console.log("logout")
    await this.authService.signout();     
  }
}
