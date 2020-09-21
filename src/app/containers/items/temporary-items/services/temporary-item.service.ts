import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Api } from 'src/app/utils/api';
import { HttpServiceModel, ResponseData } from 'src/app/utils/interfaces/http.models';
import {TemporaryItemModel } from '../services/temporary-item.service.models'

@Injectable({
  providedIn: 'root'
})
export class TemporaryItemService implements HttpServiceModel {

  constructor(private http: HttpClient) { }

  fetch(filters?: { [key: string]: any; }): Promise<ResponseData> {
    return this.http.get<ResponseData>(Api.TEMPORARY_ITEMS_END_POINT).toPromise();
  }

  get(id: string, deep?: number): Promise<TemporaryItemModel> {
    return this.http
      .get<ResponseData>(Api.TEMPORARY_ITEMS_END_POINT + `/${id}`)
      .pipe(
        map((resp: { data }) => resp.data)
      ).toPromise();
  } 

  add(item: any): Promise<ResponseData> {
    return this.http.post(Api.TEMPORARY_ITEMS_END_POINT, item).pipe(
      map((resp: { data }) => resp.data)
    ).toPromise();
  }

  update(item: any): Promise<ResponseData> {
    return this.http.put(Api.TEMPORARY_ITEMS_END_POINT, item).pipe(
      map((resp: { data }) => resp.data)
    ).toPromise();
  }

  remove(id: string): Promise<ResponseData> {
    return this.http.delete(Api.TEMPORARY_ITEMS_END_POINT+`/${id}`).pipe(
      map((resp: { data }) => resp.data)
    ).toPromise();
  }
}
