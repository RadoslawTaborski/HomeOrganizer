import { Injectable } from '@angular/core';
import { HttpServiceModel, ResponseData } from 'src/app/utils/interfaces/http.models';
import { SubCategory } from '../../models/models';
import { Cache } from '../../../../modules/shared/utils/Cache'
import { Observable, of } from 'rxjs';
import { CategoryService } from '../category/category.service';
import { map } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class SubcategoryService implements HttpServiceModel {

  private cache: Cache<SubCategory> = new Cache();

  constructor(
    private categoryService: CategoryService
    ) { }

  fetch(filters?: { [key: string]: any; }): Promise<ResponseData> {
    return this.mockFetch();
  }

  async get(id: string, deep?:number): Promise<SubCategory> {
    let entity = this.cache.get(id);
    if(entity == null) {
      await this.fetch();
      if(deep==1){
        return null
      }
      return this.get(id,1);
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

  async mockFetch(): Promise<ResponseData> {
    let categories : SubCategory[] = [
      new SubCategory({id:'1', name: 'nabiał', parent: await this.categoryService.get("2")}),
      new SubCategory({id:'2', name: 'łazienka', parent: await this.categoryService.get("1")}),
      new SubCategory({id:'3', name: 'kuchnia', parent: await this.categoryService.get("1")})
    ]

    categories.forEach(t=>this.cache.put(t.id, t))

    let response: ResponseData = {
      data: categories,
      total: 3,
      message: 'OK',
      error: ''
    }

    categories.forEach(f=>{
      this.cache.put(f.id, f);
    })

    return of(response).toPromise();
  }
}
