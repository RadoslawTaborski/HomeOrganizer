import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { HttpServiceModel, ResponseData } from 'src/app/utils/interfaces/http.models';
import { SubcategoryService } from '../../services/subcategory/subcategory.service';
import {TemporaryItemModel } from '../services/temporary-item.service.models'

@Injectable({
  providedIn: 'root'
})
export class TemporaryItemService implements HttpServiceModel {

  constructor(
    private http: HttpClient,
    private subcategoryService: SubcategoryService
    ) { }

  fetch(filters?: { [key: string]: any; }): Promise<ResponseData> {
    return this.mockFetch(filters);
  }
  get(id: string, deep?: number): Promise<any> {
    throw new Error('Method not implemented.');
  }
  add(item: any): Promise<ResponseData> {
    throw new Error('Method not implemented.');
  }
  update(item: any): Promise<ResponseData> {
    throw new Error('Method not implemented.');
  }
  remove(id: string): Promise<ResponseData> {
    throw new Error('Method not implemented.');
  }

  async mockFetch(filters?: { [key: string]: any; }): Promise<ResponseData> {
    let items: TemporaryItemModel[] = [
      new TemporaryItemModel({id: "1", name: 'szczotka do toalety', category: await this.subcategoryService.get("2"), quantity: "1 kg"}),
      new TemporaryItemModel({id: "2", name: 'sitko', category: await this.subcategoryService.get("3"), quantity: "1 kg"}),
      new TemporaryItemModel({id: "3", name: 'kremówka', category: await this.subcategoryService.get("1"), quantity: "1 kg"}),
      new TemporaryItemModel({id: "4", name: 'kieliszki', category: await this.subcategoryService.get("2"), quantity: "1 kg"}),
      new TemporaryItemModel({id: "5", name: 'twaróg sernikowy', category: await this.subcategoryService.get("1"), quantity: "1 kg"}),
      new TemporaryItemModel({id: "6", name: 'pumeks', category: await this.subcategoryService.get("2"), quantity: "1 kg"}),
      new TemporaryItemModel({id: "7", name: 'szczoteczka', category: await this.subcategoryService.get("2"), quantity: "1 kg"}),
    ]

    if(filters.name && filters.name !==""){
    items = items.filter(t=>t.name.includes(filters.name));
    }

    if(filters.subcategory && filters.subcategory !=="null"){
      items = items.filter(t=>t.category.id === filters.subcategory);
    } else if(filters.category && filters.category !=="null"){
      items = items.filter(t=>t.category.parent.id === filters.category);
    }

    let start = filters.currentPage*filters.itemsPerPage-filters.itemsPerPage;
    let end = filters.currentPage*filters.itemsPerPage;
    let pageitems = items.slice(start,end)

    let response: ResponseData = {
      data: pageitems,
      total: items.length,
      message: 'OK',
      error: ''
    }

    return of(response).toPromise();
  }
}
