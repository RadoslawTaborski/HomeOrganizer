import { Injectable } from '@angular/core';
import { DataProviderService } from './data-provider.service';
import { Category } from '../settings/categories/services/categories.service.models';
import { SubCategory } from '../settings/subcategories/services/subcategories.service.models';
import { ListCategory } from '../settings/listcategories/services/listcategories.service.models';

@Injectable({
  providedIn: 'root'
})
export class OperationsService {

  constructor(
    private dataProvider: DataProviderService
  ) { }

  public async getListCategories(subcategoryId?: string): Promise<ListCategory[]> {
    let result: ListCategory[] = Object.assign([], await this.dataProvider.listcategories);
    result.unshift(new ListCategory({ id: "" }));

    return result;
  }

  public async getCategories(subcategoryId?: string): Promise<Category[]> {
    let result: Category[] = await this.updateCategories(subcategoryId)
    result.unshift(new Category({ id: "" }));

    return result;
  }

  public async getSubCategories(categoryId?: string): Promise<SubCategory[]> {
    let result: SubCategory[] = await this.updateSubCategories(categoryId)
    result.unshift(new SubCategory({ id: "" }));

    return result;
  }

  public async updateFilters(categories: Category[], subcategories: SubCategory[], value?) {
    if (value.category && value.category.id !== "") {
      this.replace(subcategories, await this.getSubCategories(value.category));
      this.replace(categories, await this.getCategories());
    } else if (value.subcategory && value.subcategory.id !== "") {
      this.replace(categories, await this.getCategories(value.subcategory));
    } else {
      this.replace(categories, await this.getCategories());
      this.replace(subcategories, await this.getSubCategories());
    }
  }

  public async fetchSubCategories(categories: Category[], subcategories: SubCategory[]) {
    await this.dataProvider.reloadSubCategories();

    categories = Object.assign([], this.dataProvider.categories)
    subcategories = Object.assign([], this.dataProvider.subcategories)
  }

  private replace(reference, array) {
    [].splice.apply(reference, [0, reference.length].concat(array));
  }

  private async updateCategories(subcategoryId?: string): Promise<Category[]> {
    if (subcategoryId) {
      return Object.assign([], this.dataProvider.categories.filter(c => c.id === this.dataProvider.subcategories.filter(t => t?.id === subcategoryId)[0].parent.id))
    } else {
      return Object.assign([], this.dataProvider.categories);
    }
  }

  private async updateSubCategories(categoryId?: string): Promise<SubCategory[]> {
    if (categoryId) {
      return Object.assign([], this.dataProvider.subcategories.filter(c => c.parent.id === categoryId))
    } else {
      return Object.assign([], this.dataProvider.subcategories)
    }
  }
}
