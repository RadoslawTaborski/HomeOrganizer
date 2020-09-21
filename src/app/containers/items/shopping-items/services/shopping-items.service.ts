import { Injectable } from '@angular/core';
import { HttpServiceModel, ResponseData } from 'src/app/utils/interfaces/http.models';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { ShoppingItemModel } from './shopping-items.service.models'
import { SubcategoryService } from '../../services/subcategory/subcategory.service';
import { State } from '../../permanent-items/services/permanent-item.service.models';
import { StateService } from '../../services/state/state.service';
import { map } from 'rxjs/operators';
import { Api } from 'src/app/utils/api';


@Injectable({
  providedIn: 'root'
})
export class ShoppingItemsService implements HttpServiceModel {

  constructor(private http: HttpClient) { }

  fetch(filters?: { [key: string]: any; }): Promise<ResponseData> {
    return this.http.get<ResponseData>(Api.ITEMS_END_POINT).toPromise();
  }

  get(id: string, deep?: number): Promise<ShoppingItemsService> {
    return this.http
      .get<ResponseData>(Api.ITEMS_END_POINT + `/${id}`)
      .pipe(
        map((resp: { data }) => resp.data)
      ).toPromise();
  } 

  add(item: any): Promise<ResponseData> {
    return this.http.post(Api.ITEMS_END_POINT, item).pipe(
      map((resp: { data }) => resp.data)
    ).toPromise();
  }

  update(item: any): Promise<ResponseData> {
    return this.http.put(Api.ITEMS_END_POINT, item).pipe(
      map((resp: { data }) => resp.data)
    ).toPromise();
  }

  remove(id: string): Promise<ResponseData> {
    return this.http.delete(Api.ITEMS_END_POINT+`/${id}`).pipe(
      map((resp: { data }) => resp.data)
    ).toPromise();
  }
}
