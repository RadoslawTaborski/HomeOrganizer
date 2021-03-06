import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Api } from 'src/app/utils/api';
import { HttpServiceModel, ResponseData } from 'src/app/utils/interfaces/http.models';
import { IShoppingListModel, ShoppingListModel } from './shopping-lists.service.models';

const httpOptions = {
  headers: new HttpHeaders().append('Content-Type', 'application/json')
};

@Injectable({
  providedIn: 'root'
})
export class ShoppingListsService implements HttpServiceModel {

  constructor(private http: HttpClient) { }

  fetch(filters?: { [key: string]: any; }): Promise<ResponseData> {
    return this.http.get<ResponseData>(Api.SHOPPING_LISTS_END_POINT, {params: filters}).toPromise();
  }

  get(id: string, deep?: number): Promise<ShoppingListModel> {
    return this.http
      .get<IShoppingListModel>(Api.SHOPPING_LISTS_END_POINT + `/${id}`)
      .pipe(
        map((resp) => resp)
      ).toPromise();
  } 

  add(item: any): Promise<string> {
    return this.http.post(Api.SHOPPING_LISTS_END_POINT, item, httpOptions).pipe(
      map((resp: { uuid }) => resp.uuid)
    ).toPromise();
  }

  update(item: any): Promise<string> {
    return this.http.put(Api.SHOPPING_LISTS_END_POINT, item, httpOptions).pipe(
      map((resp: { uuid }) => resp.uuid)
    ).toPromise();
  }

  remove(id: string): Promise<any> {
    return this.http.delete(Api.SHOPPING_LISTS_END_POINT+`/${id}`).pipe(
      map((resp: { data }) => resp)
    ).toPromise();
  }
}
