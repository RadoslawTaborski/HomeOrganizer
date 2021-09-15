import { Injectable } from '@angular/core';
import {
  HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse
} from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../services/authentication/auth.service';

/** Pass untouched request through to the next request handler. */
@Injectable()
export class XhrInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      return this.sendRequest(req, next);
  }

  sendRequest(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>{
    let header = this.authService.authorizationHeaderValue;
    let reqClone = req;
    if(header){
      reqClone = this.addHeader(req, header);
    }
    return next
      .handle(reqClone)
      .pipe(
        catchError(({status, error, message}: HttpErrorResponse) => {
          switch (status) {
            case 401:
            default:
                console.log(status + '\n' + error + '\n' + message);
          }
          return throwError(error);
        })
      )
  }

  addHeader(req: HttpRequest<any>, token: string) {
    return req.clone({
      headers: req.headers
        .set('Authorization', `${token}`)
        .set('Content-Type', `application/json`)
    });
  }
}