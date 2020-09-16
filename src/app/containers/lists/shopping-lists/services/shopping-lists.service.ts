import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { SubcategoryService } from 'src/app/containers/items/services/subcategory/subcategory.service';
import { TemporaryItemModel } from 'src/app/containers/items/temporary-items/services/temporary-item.service.models';
import { HttpServiceModel, ResponseData } from 'src/app/utils/interfaces/http.models';
import { ShoppingListModel } from './shopping-lists.service.models';

@Injectable({
  providedIn: 'root'
})
export class ShoppingListsService implements HttpServiceModel {

  constructor(
    private http: HttpClient,
    private subcategoryService: SubcategoryService
  ) {}

  fetch(filters?: { [key: string]: any; }): Promise<ResponseData> {
    return this.mockFetch(filters);
  }
  get(id: string, deep?: number): Promise<ShoppingListModel> {
    return this.mockGet(id);
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
    let items = await this.mockItems();
    let start = filters.currentPage * filters.itemsPerPage - filters.itemsPerPage;
    let end = filters.currentPage * filters.itemsPerPage;
    let pageitems = items.slice(start, end)

    let response: ResponseData = {
      data: pageitems,
      total: items.length,
      message: 'OK',
      error: ''
    }

    return of(response).toPromise();
  }

  async mockGet(id: string): Promise<ShoppingListModel> {
    let items = await this.mockItems();
    let pageitems = items.filter(i=>i.id==id)[0];

    return of(pageitems).toPromise();
  }

  async mockItems(): Promise<ShoppingListModel[]> {
    return [
      new ShoppingListModel({
        id: "1", name: 'weekend', created: "07.09.2020", updated: "09.09.2020",
        data: [
          new TemporaryItemModel({ id: "1", name: 'szotka do toalety', category: await this.subcategoryService.get("2"), quantity: "1 kg" }),
          new TemporaryItemModel({ id: "2", name: 'sitko', category: await this.subcategoryService.get("3"), quantity: "1 kg" }),
          new TemporaryItemModel({ id: "3", name: 'kremówka', category: await this.subcategoryService.get("1"), quantity: "1 kg" }),
        ]
      }),
      new ShoppingListModel({
        id: "2", name: 'parapetówa', created: "07.09.2020", updated: "09.09.2020",
        data: [
          new TemporaryItemModel({ id: "4", name: 'kieliszki', category: await this.subcategoryService.get("2"), quantity: "1 kg" }),
          new TemporaryItemModel({ id: "5", name: 'twaróg sernikowy', category: await this.subcategoryService.get("1"), quantity: "1 kg" }),
        ]
      }),
      new ShoppingListModel({
        id: "3", name: 'obiad środa', created: "07.09.2020", updated: "09.09.2020",
        data: [
          new TemporaryItemModel({ id: "6", name: 'pumeks', category: await this.subcategoryService.get("2"), quantity: "1 kg" }),
          new TemporaryItemModel({ id: "7", name: 'szczoteczka', category: await this.subcategoryService.get("2"), quantity: "1 kg" }),
        ]
      }),
    ]
  }
}
