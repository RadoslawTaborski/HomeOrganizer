import { Injectable } from '@angular/core';
import { HttpServiceModel, ResponseData } from 'src/app/utils/interfaces/http.models';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Api } from '../../../../utils/api'
import { map } from 'rxjs/operators';
import { Group } from './groups.service.models';

const httpOptions = {
  headers: new HttpHeaders()
  .append('Content-Type', 'application/json')
};

@Injectable({
  providedIn: 'root'
})
export class GroupService implements HttpServiceModel {

  constructor(private http: HttpClient) { }

  fetch(filters?: { [key: string]: any; }): Promise<ResponseData> {
    return this.http.get<ResponseData>(Api.EXPENSES_END_POINT, {params: filters}).toPromise();
  }

  get(id: string, deep?: number): Promise<Group> {
    return this.http
      .get<ResponseData>(Api.EXPENSES_END_POINT + `/${id}`)
      .pipe(
        map((resp: { data }) => resp.data)
      ).toPromise();
  } 

  add(item: any): Promise<ResponseData> {
    return this.http.post(Api.EXPENSES_END_POINT, item, httpOptions).pipe(
      map((resp: { data }) => resp.data)
    ).toPromise();
  }

  update(item: any): Promise<ResponseData> {
    return this.http.put(Api.EXPENSES_END_POINT, item, httpOptions).pipe(
      map((resp: { data }) => resp.data)
    ).toPromise();
  }

  remove(id: string): Promise<ResponseData> {
    return this.http.delete(Api.EXPENSES_END_POINT+`/${id}`).pipe(
      map((resp: { data }) => resp.data)
    ).toPromise();
  }
}
