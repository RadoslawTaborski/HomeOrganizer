import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { UserManager, UserManagerSettings, User } from 'oidc-client';
import { BehaviorSubject, throwError } from 'rxjs';

import { environment } from '../../../../../environments/environment';
import { Router } from '@angular/router';
import { ConfigService } from '../config/config.service';
import { AppConfig } from '../config/app-config';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Observable navItem source
  private _authNavStatusSource = new BehaviorSubject<boolean>(false);
  // Observable navItem stream
  authNavStatus$ = this._authNavStatusSource.asObservable();

  private manager: UserManager;
  private user: User = null;
  private authorityAccount: string = ''

  constructor(private http: HttpClient, private router: Router) { }

  initialize(config: AppConfig) {
    this.manager = new UserManager(getClientSettings(config));
    this.manager.getUser().then(user => {
      this.user = user;
      this._authNavStatusSource.next(this.isAuthenticated());
      this.subscribeevents();
    });
    if (this.user == null && window.location.pathname !== environment.authConfig.redirect_component_register) {
      this.manager.signinSilent().then(x => this.router.navigate([environment.authConfig.redirect_component_signin])).catch(x => this.login())
      this._authNavStatusSource.next(this.isAuthenticated());
    }
    this.authorityAccount = config.authority + 'api/account';
  }

  login() {
    this.manager.signinRedirect();
  }

  public refreshUser(): void {
    this.manager.getUser().then(user => {
      this.user = user;
    });
  }

  public subscribeevents(): void {
    this.manager.events.addSilentRenewError((e) => {
      console.log(new Date().toLocaleTimeString() + " error SilentRenew", e);
    });

    this.manager.events.addAccessTokenExpiring(() => {
      console.log(new Date().toLocaleTimeString() + " access token expiring");
    });

    this.manager.events.addAccessTokenExpired(() => {
      console.log(new Date().toLocaleTimeString() + " access token expired");
      this.user = null;
      this._authNavStatusSource.next(this.isAuthenticated());
      console.log(this.router.url)
      if (this.router.url === environment.authConfig.redirect_component_register) {
        return;
      }
      this.router.navigate([environment.authConfig.redirect_component_signout]);
    });

    this.manager.events.addUserLoaded(() => {
      console.log(new Date().toLocaleTimeString() + " user loaded");
      this.manager.getUser().then(user => {
        this.user = user;
        this._authNavStatusSource.next(this.isAuthenticated());
      });
    });

    this.manager.events.addUserSignedOut(() => {
      console.log(new Date().toLocaleTimeString() + " user signedOut");
      this.manager.getUser().then(user => {
        this.user = null;
        this._authNavStatusSource.next(this.isAuthenticated());
        this.router.navigate([environment.authConfig.redirect_component_signout]);
      });
    });
  }

  async completeAuthentication() {
    this.user = await this.manager.signinRedirectCallback();
    this._authNavStatusSource.next(this.isAuthenticated());
  }

  register(userRegistration: any) {
    return this.http.post(this.authorityAccount, userRegistration)
      .pipe(
        catchError(({ status, error: { error, message } }: HttpErrorResponse) => {
          switch (status) {
            default:
              alert(error + '\n' + message);
          }
          return throwError(error);
        })
      )
  }

  isAuthenticated(): boolean {
    return this.user != null && !this.user.expired;
  }

  get authorizationHeaderValue(): string {
    if (this.user) {
      return `${this.user.token_type} ${this.user.access_token}`;
    }
    return null;
  }

  get name(): string {
    return this.isAuthenticated() ? this.user.profile.name : '';
  }

  get id(): string {
    return this.isAuthenticated() ? this.user.profile.sub : '';
  }

  async signout() {
    await this.manager.signoutRedirect();
    this.user = null;
  }
}

export function getClientSettings(config: AppConfig): UserManagerSettings {
  let authority: string = config.authority;
  let url: string = config.url;
  return {
    authority: authority,
    client_id: config.id,
    redirect_uri: url + 'auth-callback',
    post_logout_redirect_uri: url,
    response_type: config.responseType,
    scope: config.scope,
    filterProtocolClaims: true,
    loadUserInfo: true,
    automaticSilentRenew: true,
    monitorSession: false,
    silent_redirect_uri: url + 'assets/silent-refresh.html',
    silentRequestTimeout: 5000
    //userStore: new WebStorageStateStore({ store: window.localStorage })
  };
}
