import { Injectable } from '@angular/core';
import { HttpServiceModel, ResponseData } from 'src/app/utils/interfaces/http.models';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { ShoppingItemModel } from './shopping-items.service.models'
import { SubcategoryService } from '../../services/subcategory/subcategory.service';
import { State } from '../../permanent-items/services/permanent-item.service.models';


@Injectable({
  providedIn: 'root'
})
export class ShoppingItemsService implements HttpServiceModel {

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
    let items: ShoppingItemModel[] = [
      new ShoppingItemModel({ id: "1", name: 'papier toaletowy', category: await this.subcategoryService.get("2"), state: State.CRITICAL, updateTime: '12.08.2019' }),
      new ShoppingItemModel({ id: "2", name: 'płyn do naczyń', category: await this.subcategoryService.get("3"), state: State.LITTLE, updateTime: '13.08.2019' }),
      new ShoppingItemModel({ id: "3", name: 'mleko', category: await this.subcategoryService.get("1"), state: State.MEDIUM, updateTime: '14.08.2019' }),
      new ShoppingItemModel({ id: "4", name: 'ręcznik papierowy', category: await this.subcategoryService.get("2"), quantity: "2 rolki", updateTime: '15.08.2019' }),
      new ShoppingItemModel({ id: "5", name: 'masło', category: await this.subcategoryService.get("1"), quantity: "1 kostka", updateTime: '16.08.2019' }),
      new ShoppingItemModel({ id: "6", name: 'kostka do wc', category: await this.subcategoryService.get("2"), quantity: "1 sztuka", updateTime: '17.08.2019' }),
      new ShoppingItemModel({ id: "7", name: 'płyn do płukania', category: await this.subcategoryService.get("2"), quantity: "1 sztuka", updateTime: '18.08.2019' }),
    ]

    items = this.sort(items);

    if (filters.name && filters.name !== "") {
      items = items.filter(t => t.name.includes(filters.name));
    }

    if (filters.subcategory && filters.subcategory !== "null") {
      items = items.filter(t => t.category.id === filters.subcategory);
    } else if (filters.category && filters.category !== "null") {
      items = items.filter(t => t.category.parent.id === filters.category);
    }

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

  sort(array: ShoppingItemModel[]): ShoppingItemModel[] {
    array.sort((obj1, obj2) => {
      if (obj1.state == null && obj2.state != null) {
        return -1;
      }
      if (obj2.state == null && obj1.state != null) {
        return 1;
      }
      if (obj2.state == null && obj1.state == null) {
        return 0;
      }

      if (obj1.state < obj2.state) {
        return -1;
      }

      if (obj1.state > obj2.state) {
        return 1;
      }

      return 0;
    })
    return array;
  }
}

