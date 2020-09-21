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
import { ShoppingListModel } from '../lists/shopping-lists/services/shopping-lists.service.models';
import { TemporaryItemService } from '../items/temporary-items/services/temporary-item.service';
import { ITemporaryItemModel, TemporaryItemModel } from '../items/temporary-items/services/temporary-item.service.models';

@Injectable({
  providedIn: 'root'
})
export class DataProviderService {

  categories: Category[] = [];
  subcategories: SubCategory[] = [];
  states: State[] = [];

  constructor(
    private categoryService: CategoryService,
    private subcategoryService: SubcategoryService,
    private stateService: StateService,
    private permanentItemService: PermanentItemService,
    private shoppingItemService: ShoppingItemsService,
    private temporaryItemService: TemporaryItemService,
    private shoppingListsService: ShoppingListsService
  ) { }

  async reloadCategories(filters?: { [key: string]: any; }){
    let tmp: any[]
    this.categories = [];
    tmp = (await this.categoryService.fetch(filters)).data;
    tmp.forEach(a => this.categories.push(Category.createFromJson(a)))
  }

  async reloadSubCategories(filters?: { [key: string]: any; }){
    await this.reloadCategories();
    let tmp: any[]
    this.subcategories = [];
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
    this.states = [];
    let response = (await this.permanentItemService.fetch(filters));
    let data: any[] = []
    response.data.forEach(a => data.push(PermanentItemModel.createFromJson(a, this.states, this.subcategories)))

    return {data: data, total:response.total, error:"", message:""};
  }

  async getShoppingItems(filters?: { [key: string]: any; }) : Promise<ResponseData>{
    this.states = [];
    let response = (await this.shoppingItemService.fetch(filters));
    let data: any[] = []
    response.data.forEach(a => data.push(ShoppingItemModel.createFromJson(a, this.states, this.subcategories)))

    return {data: data, total:response.total, error:"", message:""};
  }

  async getTemporeryItems(filters?: { [key: string]: any; }) : Promise<ResponseData>{
    this.states = [];
    let response = (await this.temporaryItemService.fetch(filters));
    let data: any[] = []
    response.data.forEach(a => data.push(TemporaryItemModel.createFromJson(a, this.subcategories)))

    return {data: data, total:response.total, error:"", message:""};
  }

  async getShoppingLists(filters?: { [key: string]: any; }) : Promise<ResponseData>{
    let temporaryItems: ITemporaryItemModel[] = (await this.getTemporeryItems()).data
    this.states = [];
    let response = (await this.shoppingListsService.fetch(filters));
    let data: any[] = []
    response.data.forEach(a => data.push(ShoppingListModel.createFromJson(a, temporaryItems)))

    return {data: data, total:response.total, error:"", message:""};
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
