import { Injectable } from '@angular/core';
import { StateService } from '../items/services/state/state.service';
import { Category, State, SubCategory } from '../items/models/models';
import { CategoryService } from '../items/services/category/category.service';
import { PermanentItemService } from '../items/permanent-items/services/permanent-item.service';
import { PermanentItemModel } from '../items/permanent-items/services/permanent-item.service.models';
import { SubcategoryService } from '../items/services/subcategory/subcategory.service';
import { ResponseData } from 'src/app/utils/interfaces/http.models';
import { ShoppingItemsService } from '../items/shopping-items/services/shopping-items.service';
import { ShoppingItemModel } from '../items/shopping-items/services/shopping-items.service.models';
import { ShoppingListsService } from '../lists/shopping-lists/services/shopping-lists.service';
import { IShoppingListModel, ShoppingListModel } from '../lists/shopping-lists/services/shopping-lists.service.models';
import { TemporaryItemService } from '../items/temporary-items/services/temporary-item.service';
import { ITemporaryItemModel, TemporaryItemModel } from '../items/temporary-items/services/temporary-item.service.models';

@Injectable({
  providedIn: 'root'
})
export class DataProviderService {

  categories: Category[] = [];
  subcategories: SubCategory[] = [];
  states: State[] = [];
  group = "1";

  constructor(
    private categoryService: CategoryService,
    private subcategoryService: SubcategoryService,
    private stateService: StateService,
    private permanentItemService: PermanentItemService,
    private shoppingItemService: ShoppingItemsService,
    private temporaryItemService: TemporaryItemService,
    private shoppingListsService: ShoppingListsService
  ) { }

  private extendsFilters(groupId: string, filters: { [key: string]: any; }): any{
    if(!filters){
      filters = {};
    }
    filters["groupId"] = groupId;
    return filters;
  }

  async reloadCategories(filters?: { [key: string]: any; }){
    filters = this.extendsFilters(this.group, filters);
    let tmp: any[]
    this.categories = [];
    tmp = (await this.categoryService.fetch(filters)).data;
    tmp.forEach(a => this.categories.push(Category.createFromJson(a)))
  }

  async reloadSubCategories(filters?: { [key: string]: any; }){
    await this.reloadCategories(filters);
    let tmp: any[]
    this.subcategories = [];
    filters = this.extendsFilters(this.group, filters);
    tmp = (await this.subcategoryService.fetch(filters)).data;
    tmp.forEach(a => this.subcategories.push(SubCategory.createFromJson(a, this.categories)))
  } 

  async reloadStates(filters?: { [key: string]: any; }){
    let tmp: any[]
    this.states = [];
    tmp = (await this.stateService.fetch(filters)).data;
    tmp.forEach(a => this.states.push(State.createFromJson(a)))
  }

  async getPermanentItems(filters?: { [key: string]: any; }) : Promise<ResponseData>{
    filters = this.extendsFilters(this.group, filters);
    let response = (await this.permanentItemService.fetch(filters));
    let data: any[] = []
    response.data.forEach(a => data.push(PermanentItemModel.createFromJson(a, this.states, this.subcategories)))

    return {data: data, total:response.total, error:"", message:""};
  }

  async getShoppingItems(filters?: { [key: string]: any; }) : Promise<ResponseData>{
    filters = this.extendsFilters(this.group, filters);
    let response = (await this.shoppingItemService.fetch(filters));
    let data: any[] = []
    response.data.forEach(a => data.push(ShoppingItemModel.createFromJson(a, this.states, this.subcategories)))

    return {data: data, total:response.total, error:"", message:""};
  }

  async getTemporeryItems(filters?: { [key: string]: any; }) : Promise<ResponseData>{
    filters = this.extendsFilters(this.group, filters);
    let response = (await this.temporaryItemService.fetch(filters));
    let data: any[] = []
    response.data.forEach(a => data.push(TemporaryItemModel.createFromJson(a, this.subcategories)))

    return {data: data, total:response.total, error:"", message:""};
  }

  async getShoppingLists(filters?: { [key: string]: any; }) : Promise<ResponseData>{
    filters = this.extendsFilters(this.group, filters);
    let temporaryItems: ITemporaryItemModel[] = (await this.getTemporeryItems()).data
    let response = (await this.shoppingListsService.fetch(filters));
    let data: any[] = []
    response.data.forEach(a => data.push(ShoppingListModel.createFromJson(a, temporaryItems)))
    return {data: data, total:response.total, error:"", message:""};
  }

  async getShoppingList(id: string) : Promise<IShoppingListModel>{
    let temporaryItems: ITemporaryItemModel[] = (await this.getTemporeryItems()).data
    let response = (await this.shoppingListsService.get(id));
    return ShoppingListModel.createFromJson(response, temporaryItems)
  }

  async addShoppingList(list: ShoppingListModel): Promise<ResponseData>{
    return await this.shoppingListsService.add(ShoppingListModel.toJson(list));
  }

  async removeShoppingList(list: ShoppingListModel): Promise<ResponseData>{
    return await this.shoppingListsService.remove(list.id);
  }

  async updateShoppingList(list: ShoppingListModel): Promise<ResponseData>{
    return await this.shoppingListsService.update(ShoppingListModel.toJson(list));
  }

  async addPermanentItem(item: PermanentItemModel): Promise<ResponseData>{
    return await this.permanentItemService.add(PermanentItemModel.toJson(item));
  }

  async removePermanentItem(item: PermanentItemModel): Promise<ResponseData>{
    return await this.permanentItemService.remove(item.id);
  }

  async updatePermanentItem(item: PermanentItemModel): Promise<ResponseData>{
    return await this.permanentItemService.update(PermanentItemModel.toJson(item));
  }

  async addTemporaryItem(item: TemporaryItemModel): Promise<ResponseData>{
    return await this.temporaryItemService.add(TemporaryItemModel.toJson(item));
  }

  async removeTemporaryItem(item: TemporaryItemModel): Promise<ResponseData>{
    return await this.temporaryItemService.remove(item.id);
  }

  async updateTemporaryItem(item: TemporaryItemModel): Promise<ResponseData>{
    return await this.temporaryItemService.update(TemporaryItemModel.toJson(item));
  }

  getCriticalState(): State {
    return this.states.filter(i=>i.name === "CRITICAL")[0];
  }

  getLittleState(): State {
    return this.states.filter(i=>i.name === "LITTLE")[0];
  }

  getMediumState(): State {
    return this.states.filter(i=>i.name === "MEDIUM")[0];
  }

  getLotState(): State {
    return this.states.filter(i=>i.name === "LOT")[0];
  }
}
