import { Injectable } from '@angular/core';
import { DataProviderService } from '../../services/data-provider.service';
import { Category, SubCategory } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class OperationsService {

  constructor(
    private dataProvider: DataProviderService
  ) { }

  public async getCategories(subcategoryId?: string) : Promise<Category[]>{
    let result: Category[] = await this.updateCategories(subcategoryId)
    result.unshift(null);

    return result;
  }

  public async getSubCategories(categoryId?: string): Promise<SubCategory[]> {
    let result: SubCategory[] = await this.updateSubCategories(categoryId)
    result.unshift(null);

    return result;
  }

  public async updateFilters(categories: Category[], subcategories: SubCategory[], value?) {
    if (value.category && value.category !== "null") {
      this.replace(subcategories, await this.getSubCategories(value.category));
      this.replace(categories, await this.getCategories());
    } else if (value.subcategory && value.subcategory !== "null") {
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
