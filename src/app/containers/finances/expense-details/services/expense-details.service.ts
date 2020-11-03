import { Injectable } from '@angular/core';
import { HttpServiceModel, ResponseData } from 'src/app/utils/interfaces/http.models';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Api } from '../../../../utils/api'
import { map } from 'rxjs/operators';
import { ExpenseDetail } from './expense-details.service.models';

const httpOptions = {
  headers: new HttpHeaders()
  .append('Content-Type', 'application/json')
};

@Injectable({
  providedIn: 'root'
})
export class ExpenseDetailsService implements HttpServiceModel {

  constructor(private http: HttpClient) { }

  fetch(filters?: { [key: string]: any; }): Promise<ResponseData> {
    return this.http.get<ResponseData>(Api.EXPENSES_DETAILS_END_POINT, {params: filters}).toPromise();
  }

  get(id: string, deep?: number): Promise<ExpenseDetail> {
    return this.http
      .get<ResponseData>(Api.EXPENSES_DETAILS_END_POINT + `/${id}`)
      .pipe(
        map((resp: { data }) => resp.data)
      ).toPromise();
  } 

  add(item: any): Promise<string> {
    return this.http.post(Api.EXPENSES_DETAILS_END_POINT, item, httpOptions).pipe(
      map((resp: { uuid }) => resp.uuid)
    ).toPromise();
  }

  update(item: any): Promise<string> {
    return this.http.put(Api.EXPENSES_DETAILS_END_POINT, item, httpOptions).pipe(
      map((resp: { uuid }) => resp.uuid)
    ).toPromise();
  }

  remove(id: string): Promise<any> {
    return this.http.delete(Api.EXPENSES_DETAILS_END_POINT+`/${id}`).pipe(
      map((resp: { data }) => resp.data)
    ).toPromise();
  }
}
