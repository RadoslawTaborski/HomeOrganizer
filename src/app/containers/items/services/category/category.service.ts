import { Injectable } from '@angular/core';
import { Category } from '../../models/models';
import { Cache } from '../../../../modules/shared/utils/Cache'
import { HttpServiceModel, ResponseData } from 'src/app/utils/interfaces/http.models';
import { of, Observable } from 'rxjs';
import { renderFlagCheckIfStmt } from '@angular/compiler/src/render3/view/template';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Api } from '../../../../utils/api'
import { map } from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders()
  .append('Content-Type', 'application/json')
};

@Injectable({
  providedIn: 'root'
})
export class CategoryService implements HttpServiceModel {

  constructor(private http: HttpClient) { }

  fetch(filters?: { [key: string]: any; }): Promise<ResponseData> {
    return this.http.get<ResponseData>(Api.CATEGORIES_END_POINT).toPromise();
  }

  get(id: string, deep?: number): Promise<Category> {
    return this.http
      .get<ResponseData>(Api.CATEGORIES_END_POINT + `/${id}`)
      .pipe(
        map((resp: { data }) => resp.data)
      ).toPromise();
  } 

  add(item: any): Promise<ResponseData> {
    return this.http.post(Api.CATEGORIES_END_POINT, item).pipe(
      map((resp: { data }) => resp.data)
    ).toPromise();
  }

  update(item: any): Promise<ResponseData> {
    return this.http.put(Api.CATEGORIES_END_POINT, item).pipe(
      map((resp: { data }) => resp.data)
    ).toPromise();
  }

  remove(id: string): Promise<ResponseData> {
    return this.http.delete(Api.CATEGORIES_END_POINT+`/${id}`).pipe(
      map((resp: { data }) => resp.data)
    ).toPromise();
  }
}
