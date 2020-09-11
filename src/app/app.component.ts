import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'HomeOrganizer';

  constructor(public translate: TranslateService) {
    this.translate.addLangs(['en', 'pl']);
    this.translate.setDefaultLang('en');
  }

  ngOnInit() {
    this.translate.use('pl');
  }
}
