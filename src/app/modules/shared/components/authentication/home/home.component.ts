import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';
import { AuthService } from '../../../services/authentication/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  isLoaded = false;

  constructor(private authService: AuthService, private router: Router, private translate: TranslateService) {
    this.translate.addLangs(["en","pl"]);
  }

  ngOnInit(): void {
    this.translate.get('modules.shared.components.home.text').subscribe(t=>{
      if (this.authService.isAuthenticated()) {
        this.isLoaded = true;
        this.router.navigate([environment.authConfig.redirect_component_signin]);
      }
    })
  }

}
