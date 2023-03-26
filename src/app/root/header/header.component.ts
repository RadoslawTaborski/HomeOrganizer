import { Component, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/modules/shared/services/authentication/auth.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ConfigService } from 'src/app/modules/shared/services/config/config.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {

  appName = this.configService.config.title;
  userName: string;
  isAuthenticated: boolean;
  subscription:Subscription;

  constructor(private translate: TranslateService, private authService: AuthService, private router: Router, private configService: ConfigService) { 
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
    this.authService.login();
  }

  async signout() {
    await this.authService.signout();     
  }
}
