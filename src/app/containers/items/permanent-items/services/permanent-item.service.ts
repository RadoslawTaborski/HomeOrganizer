import { Injectable } from '@angular/core';
import { HttpServiceModel, ResponseData } from 'src/app/utils/interfaces/http.models';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { PermanentItemModel } from './permanent-item.service.models'
import { Api } from 'src/app/utils/api';
import { map } from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders().append('Content-Type', 'application/json')
};

@Injectable({
  providedIn: 'root'
})
export class PermanentItemService implements HttpServiceModel {

  constructor(private http: HttpClient) { }

  fetch(filters?: { [key: string]: any; }): Promise<ResponseData> {
    return this.http.get<ResponseData>(Api.PERMANENT_ITEMS_END_POINT, {params: filters}).toPromise();
  }

  get(id: string, deep?: number): Promise<PermanentItemModel> {
    return this.http
      .get<ResponseData>(Api.PERMANENT_ITEMS_END_POINT + `/${id}`)
      .pipe(
        map((resp: { data }) => resp.data)
      ).toPromise();
  } 

  add(item: any): Promise<ResponseData> {
    return this.http.post(Api.PERMANENT_ITEMS_END_POINT, item, httpOptions).pipe(
      map((resp: { data }) => resp.data)
    ).toPromise();
  }

  update(item: any): Promise<ResponseData> {
    return this.http.put(Api.PERMANENT_ITEMS_END_POINT, item, httpOptions).pipe(
      map((resp: { data }) => resp.data)
    ).toPromise();
  }

  remove(id: string): Promise<any> {
    return this.http.delete(Api.PERMANENT_ITEMS_END_POINT+`/${id}`).pipe(
      map((resp: { data }) => resp)
    ).toPromise();
  }
}
