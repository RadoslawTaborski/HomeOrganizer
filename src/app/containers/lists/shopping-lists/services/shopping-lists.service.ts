import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { ConfigService } from 'src/app/modules/shared/services/config/config.service';
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

  constructor(private http: HttpClient, private configService: ConfigService) { }

  fetch(filters?: { [key: string]: any; }): Promise<ResponseData> {
    return this.http.get<ResponseData>(this.configService.config.api + Api.SHOPPING_LISTS_END_POINT, { params: filters }).toPromise();
  }

  get(id: string, deep?: number): Promise<ShoppingListModel> {
    return this.http
      .get<IShoppingListModel>(this.configService.config.api + Api.SHOPPING_LISTS_END_POINT + `/${id}`)
      .pipe(
        map((resp) => resp)
      ).toPromise();
  }

  add(item: any): Promise<string> {
    return this.http.post(this.configService.config.api + Api.SHOPPING_LISTS_END_POINT, item, httpOptions).pipe(
      map((resp: { uuid }) => resp.uuid)
    ).toPromise();
  }

  update(item: any): Promise<string> {
    return this.http.put(this.configService.config.api + Api.SHOPPING_LISTS_END_POINT, item, httpOptions).pipe(
      map((resp: { uuid }) => resp.uuid)
    ).toPromise();
  }

  remove(id: string): Promise<any> {
    return this.http.delete(this.configService.config.api + Api.SHOPPING_LISTS_END_POINT + `/${id}`).pipe(
      map((resp: { data }) => resp)
    ).toPromise();
  }
}
