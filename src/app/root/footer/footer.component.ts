import { Component, OnInit } from '@angular/core';
import { ConfigService } from 'src/app/modules/shared/services/config/config.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  constructor(private configService: ConfigService) { }

  ngOnInit(): void {
  }

  getText(): string {
    return this.configService.config.footer;
  }

}
