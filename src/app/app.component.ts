import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ConfigService } from './modules/shared/services/config/config.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = '';

  constructor(public translate: TranslateService, configService: ConfigService) {
    this.translate.addLangs(['en', 'pl']);
    this.translate.setDefaultLang('en');
    this.title = configService.config.title;
  }

  ngOnInit() {
    this.translate.use('pl');
  }
}
