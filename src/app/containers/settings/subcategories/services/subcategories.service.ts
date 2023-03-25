import { Injectable } from '@angular/core';
import { HttpServiceModel, ResponseData } from 'src/app/utils/interfaces/http.models';
import { map } from 'rxjs/operators'
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Api } from 'src/app/utils/api';
import { SubCategory } from './subcategories.service.models';
import { ConfigService } from 'src/app/modules/shared/services/config/config.service';

const httpOptions = {
  headers: new HttpHeaders().append('Content-Type', 'application/json')
};

@Injectable({
  providedIn: 'root'
})
export class SubcategoriesService implements HttpServiceModel {

  constructor(private http: HttpClient, private configService: ConfigService) { }

  fetch(filters?: { [key: string]: any; }): Promise<ResponseData> {
    return this.http.get<ResponseData>(this.configService.config.api + Api.SUBCATEGORIES_END_POINT, {params: filters}).toPromise();
  }

  get(id: string, deep?: number): Promise<SubCategory> {
    return this.http
      .get<ResponseData>(this.configService.config.api + Api.SUBCATEGORIES_END_POINT + `/${id}`)
      .pipe(
        map((resp: { data }) => resp.data)
      ).toPromise();
  } 

  add(item: any): Promise<string> {
    return this.http.post(this.configService.config.api + Api.SUBCATEGORIES_END_POINT, item, httpOptions).pipe(
      map((resp: { uuid }) => resp.uuid)
    ).toPromise();
  }

  update(item: any): Promise<string> {
    return this.http.put(this.configService.config.api + Api.SUBCATEGORIES_END_POINT, item, httpOptions).pipe(
      map((resp: { uuid }) => resp.uuid)
    ).toPromise();
  }

  remove(id: string): Promise<any> {
    return this.http.delete(this.configService.config.api + Api.SUBCATEGORIES_END_POINT+`/${id}`).pipe(
      map((resp: { data }) => resp.data)
    ).toPromise();
  }
}
