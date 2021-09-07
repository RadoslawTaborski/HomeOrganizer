import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { UserManager, UserManagerSettings, User, WebStorageStateStore } from 'oidc-client';
import { BehaviorSubject, throwError } from 'rxjs';

import { environment } from '../../../../../environments/environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Observable navItem source
  private _authNavStatusSource = new BehaviorSubject<boolean>(false);
  // Observable navItem stream
  authNavStatus$ = this._authNavStatusSource.asObservable();

  private manager = new UserManager(getClientSettings());
  private user: User = null;

  constructor(private http: HttpClient, private router: Router) {
    this.manager.getUser().then(user => {
      this.user = user;
      this._authNavStatusSource.next(this.isAuthenticated());
      this.subscribeevents();
    });
  }

  login() {
    this.manager.signinRedirect();
  }

  public refreshUser(): void {
    this.manager.getUser().then(user => {
      console.log(user);
      this.user = user;
    });
  }

  public subscribeevents(): void {
    this.manager.events.addSilentRenewError((e) => {
      console.log("error SilentRenew", e);
    });

    this.manager.events.addAccessTokenExpiring(() => {
      console.log("access token expiring");
    });

    this.manager.events.addAccessTokenExpired(() => {
      console.log("access token expired");
      this.user = null;
      this.router.navigate([environment.authConfig.redirect_component_signout]);
    });

    this.manager.events.addUserLoaded(() => {
      console.log("user loaded");
      this.manager.getUser().then(user => {
        this.user = user;
        this._authNavStatusSource.next(this.isAuthenticated());
      });
    });

    this.manager.events.addUserSignedOut(() => {
      console.log("user signedOut");
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
    return this.http.post(environment.authConfig.authorityApi + '/account', userRegistration)
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
    if(this.user){
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

export function getClientSettings(): UserManagerSettings {
  return {
    authority: environment.authConfig.authority,
    client_id: environment.authConfig.client_id,
    redirect_uri: environment.authConfig.redirect_uri,
    post_logout_redirect_uri: environment.authConfig.post_logout_redirect_uri,
    response_type: environment.authConfig.response_type,
    scope: environment.authConfig.scope,
    filterProtocolClaims: true,
    loadUserInfo: true,
    automaticSilentRenew: true,
    silent_redirect_uri: environment.authConfig.silent_redirect_uri,
    userStore: new WebStorageStateStore({ store: window.localStorage })
  };
}
