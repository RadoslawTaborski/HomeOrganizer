import { Injectable } from '@angular/core';
import { HttpServiceModel, ResponseData } from 'src/app/utils/interfaces/http.models';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Api } from 'src/app/utils/api';


@Injectable({
  providedIn: 'root'
})
export class ShoppingItemsService implements HttpServiceModel {

  constructor(private http: HttpClient) { }

  fetch(filters?: { [key: string]: any; }): Promise<ResponseData> {
    return this.http.get<ResponseData>(Api.SHOPPING_ITEMS_END_POINT, {params: filters}).toPromise();
  }

  get(id: string, deep?: number): Promise<ShoppingItemsService> {
    return this.http
      .get<ResponseData>(Api.SHOPPING_ITEMS_END_POINT + `/${id}`)
      .pipe(
        map((resp: { data }) => resp.data)
      ).toPromise();
  } 

  add(item: any): Promise<string> {
    return this.http.post(Api.SHOPPING_ITEMS_END_POINT, item).pipe(
      map((resp: { uuid }) => resp.uuid)
    ).toPromise();
  }

  update(item: any): Promise<string> {
    return this.http.put(Api.SHOPPING_ITEMS_END_POINT, item).pipe(
      map((resp: { uuid }) => resp.uuid)
    ).toPromise();
  }

  remove(id: string): Promise<any> {
    return this.http.delete(Api.SHOPPING_ITEMS_END_POINT+`/${id}`).pipe(
      map((resp: { data }) => resp.data)
    ).toPromise();
  }
}
