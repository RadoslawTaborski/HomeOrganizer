import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { HttpServiceModel, ResponseData } from 'src/app/utils/interfaces/http.models';
import { ShoppingListModel } from './shopping-lists.service.models';

@Injectable({
  providedIn: 'root'
})
export class ShoppingListsService implements HttpServiceModel {

  constructor(
    private http: HttpClient,
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
    let items: ShoppingListModel[] = [
      new ShoppingListModel({id: "1", name: 'weekend'}),
      new ShoppingListModel({id: "2", name: 'parapetówa'}),
      new ShoppingListModel({id: "3", name: 'obiad środa'}),
    ]

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
