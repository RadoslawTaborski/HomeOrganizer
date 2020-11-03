import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { State } from './states.service.models';
import { Api } from 'src/app/utils/api';
import { HttpServiceModel, ResponseData } from 'src/app/utils/interfaces/http.models';

@Injectable({
  providedIn: 'root'
})
export class StatesService implements HttpServiceModel {

  constructor(private http: HttpClient) { }

  fetch(filters?: { [key: string]: any; }): Promise<ResponseData> {
    return this.http.get<ResponseData>(Api.STATES_END_POINT).toPromise();
  }

  get(id: string, deep?: number): Promise<State> {
    return this.http
      .get<ResponseData>(Api.STATES_END_POINT + `/${id}`)
      .pipe(
        map((resp: { data }) => resp.data)
      ).toPromise();
  } 

  add(item: any): Promise<string> {
    return this.http.post(Api.STATES_END_POINT, item).pipe(
      map((resp: { uuid }) => resp.uuid)
    ).toPromise();
  }

  update(item: any): Promise<string> {
    return this.http.put(Api.STATES_END_POINT, item).pipe(
      map((resp: { uuid }) => resp.uuid)
    ).toPromise();
  }

  remove(id: string): Promise<any> {
    return this.http.delete(Api.STATES_END_POINT+`/${id}`).pipe(
      map((resp: { data }) => resp.data)
    ).toPromise();
  }
}