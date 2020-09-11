import { Injectable } from '@angular/core';
import { HttpServiceModel, ResponseData } from 'src/app/utils/interfaces/http.models';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { PermanentItemModel, State } from './permanent-item.service.models'
import { SubcategoryService } from '../../services/subcategory/subcategory.service';

@Injectable({
  providedIn: 'root'
})
export class PermanentItemService implements HttpServiceModel {

  constructor(
    private http: HttpClient,
    private subcategoryService: SubcategoryService
    ) { }

  fetch(filters?: { [key: string]: any; }): Promise<ResponseData> {
    return this.mockFetch(filters);
  }

  get(id: string, deep?: number): Promise<any> {
    throw new Error("Method not implemented.");
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

  async mockFetch(filters?: { [key: string]: any; }): Promise<ResponseData> {
    let items: PermanentItemModel[] = [
      new PermanentItemModel({id: "1", name: 'papier toaletowy', category: await this.subcategoryService.get("2"), state: State.CRITICAL}),
      new PermanentItemModel({id: "2", name: 'płyn do naczyń', category: await this.subcategoryService.get("3"), state: State.LITTLE}),
      new PermanentItemModel({id: "3", name: 'mleko', category: await this.subcategoryService.get("1"), state: State.MEDIUM}),
      new PermanentItemModel({id: "4", name: 'ręcznik papierowy', category: await this.subcategoryService.get("2"), state: State.LOT}),
      new PermanentItemModel({id: "5", name: 'masło', category: await this.subcategoryService.get("1"), state: State.LOT}),
      new PermanentItemModel({id: "6", name: 'kostka do wc', category: await this.subcategoryService.get("2"), state: State.MEDIUM}),
      new PermanentItemModel({id: "7", name: 'płyn do płukania', category: await this.subcategoryService.get("2"), state: State.CRITICAL}),
    ]

    if(filters.name && filters.name !==""){
    items = items.filter(t=>t.name.includes(filters.name));
    }

    if(filters.subcategory && filters.subcategory !=="null"){
      items = items.filter(t=>t.category.id === filters.subcategory);
    } else if(filters.category && filters.category !=="null"){
      items = items.filter(t=>t.category.parent.id === filters.category);
    }

    if(filters.state && filters.state !=="null"){
      items = items.filter(t=>State[t.state] === filters.state);
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
