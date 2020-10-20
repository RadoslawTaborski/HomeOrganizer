import { Injectable } from '@angular/core';
import { HttpServiceModel, ResponseData } from 'src/app/utils/interfaces/http.models';
import { SubCategory } from '../../models/models';
import { map } from 'rxjs/operators'
import { HttpClient } from '@angular/common/http';
import { Api } from 'src/app/utils/api';

@Injectable({
  providedIn: 'root'
})
export class SubcategoryService implements HttpServiceModel {

  constructor(private http: HttpClient) { }

  fetch(filters?: { [key: string]: any; }): Promise<ResponseData> {
    return this.http.get<ResponseData>(Api.SUBCATEGORIES_END_POINT, {params: filters}).toPromise();
  }

  get(id: string, deep?: number): Promise<SubCategory> {
    return this.http
      .get<ResponseData>(Api.SUBCATEGORIES_END_POINT + `/${id}`)
      .pipe(
        map((resp: { data }) => resp.data)
      ).toPromise();
  } 

  add(item: any): Promise<ResponseData> {
    return this.http.post(Api.SUBCATEGORIES_END_POINT, item).pipe(
      map((resp: { data }) => resp.data)
    ).toPromise();
  }

  update(item: any): Promise<ResponseData> {
    return this.http.put(Api.SUBCATEGORIES_END_POINT, item).pipe(
      map((resp: { data }) => resp.data)
    ).toPromise();
  }

  remove(id: string): Promise<ResponseData> {
    return this.http.delete(Api.SUBCATEGORIES_END_POINT+`/${id}`).pipe(
      map((resp: { data }) => resp.data)
    ).toPromise();
  }
}
