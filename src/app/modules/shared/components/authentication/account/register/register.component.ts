import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { finalize } from 'rxjs/operators'
import { AuthService } from '../../../../services/authentication/auth.service';
import { UserRegistration } from './models/user.registration';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

success: boolean;
  error: string;
  userRegistration: UserRegistration = { name: '', email: '', password: ''};
  submitted: boolean = false;

  constructor(private translate: TranslateService, private authService: AuthService) {
    this.translate.addLangs(["en","pl"]);
  }

  ngOnInit() {
    this.translate.get('modules.shared.components.authentication.account.register.register').subscribe(t=>{
      
    });
  }

  onSubmit() { 
    this.authService.register(this.userRegistration)
      .pipe(finalize(() => {
      }))  
      .subscribe(
      result => {         
         if(result) {
           this.success = true;
         }
      },
      error => {
        this.error = error;       
      });
  }

}
