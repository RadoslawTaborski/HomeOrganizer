import { Injectable } from '@angular/core';
import { PermanentItemService } from '../items/permanent-items/services/permanent-item.service';
import { PermanentItemModel } from '../items/permanent-items/services/permanent-item.service.models';
import { ResponseData } from 'src/app/utils/interfaces/http.models';
import { ShoppingItemsService } from '../items/shopping-items/services/shopping-items.service';
import { ShoppingItemModel } from '../items/shopping-items/services/shopping-items.service.models';
import { ShoppingListsService } from '../lists/shopping-lists/services/shopping-lists.service';
import { IShoppingListModel, ShoppingListModel } from '../lists/shopping-lists/services/shopping-lists.service.models';
import { TemporaryItemService } from '../items/temporary-items/services/temporary-item.service';
import { TemporaryItemModel } from '../items/temporary-items/services/temporary-item.service.models';
import { Category } from '../settings/categories/services/categories.service.models';
import { ListCategory } from '../settings/listcategories/services/listcategories.service.models';
import { SubCategory } from '../settings/subcategories/services/subcategories.service.models';
import { State } from '../settings/states/services/states.service.models';
import { CategoriesService } from '../settings/categories/services/categories.service';
import { SubcategoriesService } from '../settings/subcategories/services/subcategories.service';
import { ListcategoriesService } from '../settings/listcategories/services/listcategories.service';
import { StatesService } from '../settings/states/services/states.service';
import { UsersService } from '../accounts/users/services/users.service';
import { User } from '../accounts/users/services/users.service.models';
import { Expense } from '../finances/expenses/services/expenses.service.models';
import { ExpensesService } from '../finances/expenses/services/expenses.service';
import { ExpenseDetailsService } from '../finances/expense-details/services/expense-details.service';
import { GroupService } from '../accounts/groups/services/groups.service';
import { ExpenseDetail } from '../finances/expense-details/services/expense-details.service.models';
import { Group } from '../accounts/groups/services/groups.service.models';
import { Saldo } from '../finances/saldo/services/saldo.service.models';
import { SaldoService } from '../finances/saldo/services/saldo.service';
import { ExpenseSettingsService } from '../finances/expenses-settings/services/expenses-settings.service';
import { ExpenseSettings } from '../finances/expenses-settings/services/expenses-settings.service.models';
import { AuthService } from 'src/app/modules/shared/services/authentication/auth.service';

@Injectable({
  providedIn: 'root'
})
export class DataProviderService {
  ONE_TIME_GROUP: string = "GROUP_ONE_TIME"

  groups: Group[] = [];
  users: User[] = [];
  usersSettings: ExpenseSettings[] = [];
  categories: Category[] = [];
  subcategories: SubCategory[] = [];
  listcategories: ListCategory[] = [];
  states: State[] = [];
  user: User;
  group: Group;
  oneTimeList: IShoppingListModel;

  constructor(
    private authService: AuthService,
    private categoryService: CategoriesService,
    private subcategoryService: SubcategoriesService,
    private stateService: StatesService,
    private permanentItemService: PermanentItemService,
    private shoppingItemService: ShoppingItemsService,
    private temporaryItemService: TemporaryItemService,
    private listcategoryService: ListcategoriesService,
    private shoppingListsService: ShoppingListsService,
    private groupsService: GroupService,
    private usersService: UsersService,
    private expenseDetailsService: ExpenseDetailsService,
    private expensesService: ExpensesService,
    private expensesSettingsService: ExpenseSettingsService,
    private saldoService: SaldoService
  ) { }

  private extendsFilters(groupId: string, filters: { [key: string]: any; }): any{
    if(!filters){
      filters = {};
    }
    filters["groupUuid"] = groupId;
    return filters;
  }

  async init(){
    await this.login(this.authService.id);
    await this.getGroups(this.user.id);
    this.group = this.groups[0];
    await this.reloadListcategories();
    await this.getOneTimeList(this.group)
  }

  async getOneTimeList(filters?: { [key: string]: any; }) {
    filters = this.extendsFilters(this.group.id, filters);
    filters["name"] = this.ONE_TIME_GROUP;
    let response = (await this.shoppingListsService.fetch(filters));
    this.oneTimeList = ShoppingListModel.createFromJson(response.data[0], null, this.listcategories)

  }

  async login(id: string) {
    let response = (await this.usersService.login(id));
    this.user = User.createFromJson(response);
  }

  async reloadUsersSettings(filters?: { [key: string]: any; }): Promise<ResponseData>{
    filters = this.extendsFilters(this.group.id, filters);
    let response = (await this.expensesSettingsService.fetch(filters));
    let data: any[] = []
    response.data.forEach(a => data.push(ExpenseSettings.createFromJson(a, this.users.filter(u=>u.id == a.userUuid)[0])));

    this.usersSettings = data;

    return {data: data, total:response.total, error:"", message:""};
  }

  async reloadUsers(filters?: { [key: string]: any; }): Promise<ResponseData>{
    filters = this.extendsFilters(this.group.id, filters);
    let response = (await this.usersService.fetch(filters));
    let data: any[] = []
    response.data.forEach(a => data.push(User.createFromJson(a)))

    this.users = data;

    return {data: data, total:response.total, error:"", message:""};
  }

  async reloadCategories(filters?: { [key: string]: any; }): Promise<ResponseData>{
    filters = this.extendsFilters(this.group.id, filters);
    let response = (await this.categoryService.fetch(filters));
    let data: any[] = []
    response.data.forEach(a => data.push(Category.createFromJson(a)))

    this.categories = data;

    return {data: data, total:response.total, error:"", message:""};
  }

  async reloadListcategories(filters?: { [key: string]: any; }): Promise<ResponseData>{
    filters = this.extendsFilters(this.group.id, filters);
    let response = (await this.listcategoryService.fetch(filters));
    let data: any[] = []
    response.data.forEach(a => data.push(ListCategory.createFromJson(a)))

    this.listcategories = data;

    return {data: data, total:response.total, error:"", message:""};
  }

  async reloadSubCategories(filters?: { [key: string]: any; }): Promise<ResponseData>{
    filters = this.extendsFilters(this.group.id, filters);
    filters["orderBy"]="categoryUuid asc"
    let response = (await this.subcategoryService.fetch(filters));
    let data: any[] = []
    response.data.forEach(a => data.push(SubCategory.createFromJson(a, this.categories)))

    this.subcategories = data;

    return {data: data, total:response.total, error:"", message:""};
  } 

  async reloadStates(filters?: { [key: string]: any; }): Promise<ResponseData>{
    let response = (await this.stateService.fetch(filters));
    let data: any[] = []
    response.data.forEach(a => data.push(State.createFromJson(a)))

    this.states = data;

    return {data: data, total:response.total, error:"", message:""};
  }

  async getPermanentItems(filters?: { [key: string]: any; }) : Promise<ResponseData>{
    filters = this.extendsFilters(this.group.id, filters);
    let response = (await this.permanentItemService.fetch(filters));
    let data: any[] = []
    response.data.forEach(a => data.push(PermanentItemModel.createFromJson(a, this.states, this.subcategories)))

    return {data: data, total:response.total, error:"", message:""};
  }

  async getShoppingItems(filters?: { [key: string]: any; }) : Promise<ResponseData>{
    filters = this.extendsFilters(this.group.id, filters);
    let response = (await this.shoppingItemService.fetch(filters));
    let data: any[] = []
    response.data.forEach(a => data.push(ShoppingItemModel.createFromJson(a, this.states, this.subcategories)))

    return {data: data, total:response.total, error:"", message:""};
  }

  async getTemporeryItems(filters?: { [key: string]: any; }) : Promise<ResponseData>{
    filters = this.extendsFilters(this.group.id, filters);
    let response = (await this.temporaryItemService.fetch(filters));
    let data: any[] = []
    for(let res of response.data){
      data.push(TemporaryItemModel.createFromJson(res, this.subcategories))
    }

    return {data: data, total:response.total, error:"", message:""};
  }

  async getShoppingLists(filters?: { [key: string]: any; }) : Promise<ResponseData>{
    filters = this.extendsFilters(this.group.id, filters);
    let response = (await this.shoppingListsService.fetch(filters));
    let data: any[] = []
    for(var res of response.data){
        data.push(ShoppingListModel.createSimpleFromJson(res, this.listcategories))
    }

    return {data: data, total:response.total, error:"", message:""};
  }

  async getShoppingList(id: string) : Promise<IShoppingListModel>{
    let response = (await this.shoppingListsService.get(id));
    return ShoppingListModel.createSimpleFromJson(response, this.listcategories)
  }

  async getExpenseDetails(filters?: { [key: string]: any; }) : Promise<ResponseData> {
    filters = this.extendsFilters(this.group.id, filters);
    let response = (await this.expenseDetailsService.fetch(filters));
    let data: any[] = []
    response.data.forEach(a => data.push(ExpenseDetail.createFromJson(a, this.users.filter(u=>u.id==a.payerUuid)[0], this.usersSettings.filter(u=>u.user.id==a.recipientUuid)[0])))

    return {data: data, total:response.total, error:"", message:""};
  }

  async getExpenses(filters?: { [key: string]: any; }) : Promise<ResponseData> {
    filters = this.extendsFilters(this.group.id, filters);
    let response = (await this.expensesService.fetch(filters));
    let data: any[] = []
    for(var res of response.data){
      data.push(Expense.createFromJson(res, (await this.getExpenseDetails({ "expenseUuid": `${res.uuid}` })).data))
    }

    return {data: data, total:response.total, error:"", message:""};
  }

  async getSaldos(filters?: { [key: string]: any; }) : Promise<ResponseData> {
    filters = this.extendsFilters(this.group.id, filters);
    let response = (await this.saldoService.fetch(filters));
    let data: any[] = []
    await response.data.forEach(async a => data.push(Saldo.createFromJson(a, this.users.filter(u=>u.id==a.payerUuid)[0], this.users.filter(u=>u.id==a.recipientUuid)[0])));

    return {data: data, total:response.total, error:"", message:""};
  }

  async getGroups(userId: string) : Promise<ResponseData> {
    let response = (await this.groupsService.fetch({"userUuid": `${userId}`}));
    let data: any[] = []
    response.data.forEach(a => data.push(Group.createFromJson(a)));

    this.groups = data;

    return {data: data, total:response.total, error:"", message:""};
  }

  async addShoppingList(list: ShoppingListModel): Promise<string>{
    return await this.shoppingListsService.add(ShoppingListModel.toJson(list));
  }

  async removeShoppingList(list: ShoppingListModel): Promise<ResponseData>{
    return await this.shoppingListsService.remove(list.id);
  }

  async updateShoppingList(list: ShoppingListModel): Promise<string>{
    return await this.shoppingListsService.update(ShoppingListModel.toJson(list));
  }

  async addPermanentItem(item: PermanentItemModel): Promise<string>{
    return await this.permanentItemService.add(PermanentItemModel.toJson(item));
  }

  async removePermanentItem(item: PermanentItemModel): Promise<string>{
    return await this.permanentItemService.remove(item.id);
  }

  async updatePermanentItem(item: PermanentItemModel): Promise<string>{
    return await this.permanentItemService.update(PermanentItemModel.toJson(item));
  }

  async addTemporaryItem(item: TemporaryItemModel): Promise<string>{
    return await this.temporaryItemService.add(TemporaryItemModel.toJson(item));
  }

  async removeTemporaryItem(item: TemporaryItemModel): Promise<ResponseData>{
    return await this.temporaryItemService.remove(item.id);
  }

  async updateTemporaryItem(item: TemporaryItemModel): Promise<string>{
    return await this.temporaryItemService.update(TemporaryItemModel.toJson(item));
  }

  async addSubcategories(data: SubCategory): Promise<string> {
    return await this.subcategoryService.add(SubCategory.toJson(data));
  }

  async addCategories(data: Category): Promise<string> {
    return await this.categoryService.add(Category.toJson(data));
  }

  async addListCategories(data: ListCategory): Promise<string> {
    return await this.listcategoryService.add(ListCategory.toJson(data));
  }

  async addExpenseDetail(data: ExpenseDetail, expenseId: string): Promise<string> {
    return await this.expenseDetailsService.add(ExpenseDetail.toJson(data, expenseId));
  }

  async addExpense(data: Expense): Promise<string> {
    let result = await this.expensesService.add(Expense.toJson(data));
    for(var res of data.details){
      await this.addExpenseDetail(res, result);
    }
    
    return result;
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
