import { Injectable } from '@angular/core';
import { Category } from '../../models/models';
import { Cache } from '../../../../modules/shared/utils/Cache'
import { HttpServiceModel, ResponseData } from 'src/app/utils/interfaces/http.models';
import { of, Observable } from 'rxjs';
import { renderFlagCheckIfStmt } from '@angular/compiler/src/render3/view/template';

@Injectable({
  providedIn: 'root'
})
export class CategoryService implements HttpServiceModel {

  private cache: Cache<Category> = new Cache();

  constructor() { }

  fetch(filters?: { [key: string]: any; }): Promise<ResponseData> {
    return this.mockFetch();
  }

  async get(id: string, deep?:number): Promise<Category> {
    let entity = this.cache.get(id);
    if(entity == null) {
      await this.fetch();
      if(deep==1){
        return null
      }
      return this.get(id, 1);
    }

    return of(entity).toPromise();
  }

  add(item: any): Promise<ResponseData> {
    throw new Error("Method not implemented.");
  }

  update(item: any): Promise<ResponseData> {
    throw new Error("Method not implemented.");
  }

  remove(id: string): Promise<ResponseData> {
    throw new Error("Method not implemented.");
  }

  mockFetch(): Promise<ResponseData> {
    let categories : Category[] = [
      new Category({id:'1', name: 'chemia'}),
      new Category({id:'2', name: 'spożywcze'})
    ]

    categories.forEach(t=>this.cache.put(t.id, t))
    
    let response: ResponseData = {
      data: categories,
      total: 2,
      message: 'OK',
      error: ''
    }

    categories.forEach(f=>{
      this.cache.put(f.id, f);
    })

    return of(response).toPromise();
  }
}
