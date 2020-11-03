import { Injectable } from '@angular/core';
import { HttpServiceModel, ResponseData } from 'src/app/utils/interfaces/http.models';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ExpenseSettings } from './expenses-settings.service.models'
import { Api } from 'src/app/utils/api';
import { map } from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders().append('Content-Type', 'application/json')
};

@Injectable({
  providedIn: 'root'
})
export class ExpenseSettingsService implements HttpServiceModel {

  constructor(private http: HttpClient) { }

  fetch(filters?: { [key: string]: any; }): Promise<ResponseData> {
    return this.http.get<ResponseData>(Api.EXPENSES_SETTINGS_END_POINT, {params: filters}).toPromise();
  }

  get(id: string, deep?: number): Promise<ExpenseSettings> {
    return this.http
      .get<ResponseData>(Api.EXPENSES_SETTINGS_END_POINT + `/${id}`)
      .pipe(
        map((resp: { data }) => resp.data)
      ).toPromise();
  } 

  add(item: any): Promise<string> {
    return this.http.post(Api.EXPENSES_SETTINGS_END_POINT, item, httpOptions).pipe(
      map((resp: { uuid }) => resp.uuid)
    ).toPromise();
  }

  update(item: any): Promise<string> {
    return this.http.put(Api.EXPENSES_SETTINGS_END_POINT, item, httpOptions).pipe(
      map((resp: { uuid }) => resp.uuid)
    ).toPromise();
  }

  remove(id: string): Promise<any> {
    return this.http.delete(Api.EXPENSES_SETTINGS_END_POINT+`/${id}`).pipe(
      map((resp: { data }) => resp)
    ).toPromise();
  }
}
