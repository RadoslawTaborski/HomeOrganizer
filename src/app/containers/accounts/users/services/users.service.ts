import { Injectable } from '@angular/core';
import { HttpServiceModel, ResponseData } from 'src/app/utils/interfaces/http.models';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Api } from '../../../../utils/api'
import { map } from 'rxjs/operators';
import { User } from './users.service.models';

const httpOptions = {
  headers: new HttpHeaders()
  .append('Content-Type', 'application/json')
};

@Injectable({
  providedIn: 'root'
})
export class UsersService implements HttpServiceModel {

  constructor(private http: HttpClient) { }

  fetch(filters?: { [key: string]: any; }): Promise<ResponseData> {
    return this.http.get<ResponseData>(Api.USERS_END_POINT, {params: filters}).toPromise();
  }

  get(id: string, deep?: number): Promise<User> {
    return this.http
      .get<ResponseData>(Api.USERS_END_POINT + `/${id}`)
      .pipe(
        map((resp: { data }) => resp.data)
      ).toPromise();
  } 

  login(username: string, password: string): Promise<string> {
    return this.http
      .get<string>(Api.USERS_END_POINT + `/${username}/${password}`)
      .pipe(
        map(resp => resp)
      ).toPromise();
  } 

  add(item: any): Promise<string> {
    return this.http.post(Api.USERS_END_POINT, item, httpOptions).pipe(
      map((resp: { uuid }) => resp.uuid)
    ).toPromise();
  }

  update(item: any): Promise<string> {
    return this.http.put(Api.USERS_END_POINT, item, httpOptions).pipe(
      map((resp: { uuid }) => resp.uuid)
    ).toPromise();
  }

  remove(id: string): Promise<any> {
    return this.http.delete(Api.USERS_END_POINT+`/${id}`).pipe(
      map((resp: { data }) => resp.data)
    ).toPromise();
  }
}
