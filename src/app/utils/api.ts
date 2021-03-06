import { environment } from '../../environments/environment';

export class Api {
    private static DATA_BASE_END_POINT = environment.apiEndpoint;

    // Data end-points
    static ITEMS_END_POINT = Api.DATA_BASE_END_POINT + 'items';
    static CATEGORIES_END_POINT = Api.DATA_BASE_END_POINT + 'categories';
    static SUBCATEGORIES_END_POINT = Api.DATA_BASE_END_POINT + 'subcategories';
    static STATES_END_POINT = Api.DATA_BASE_END_POINT + 'states';
    static PERMANENT_ITEMS_END_POINT = Api.DATA_BASE_END_POINT + 'permanentitems';
    static TEMPORARY_ITEMS_END_POINT = Api.DATA_BASE_END_POINT + 'temporaryitems';
    static SHOPPING_ITEMS_END_POINT = Api.DATA_BASE_END_POINT + 'shoppingitems';
    static SHOPPING_LISTS_END_POINT = Api.DATA_BASE_END_POINT + 'shoppinglists';

    static EXPENSES_SETTINGS_END_POINT = Api.DATA_BASE_END_POINT + 'expensessettings';
    static EXPENSES_END_POINT = Api.DATA_BASE_END_POINT + 'expenses';
    static EXPENSES_DETAILS_END_POINT = Api.DATA_BASE_END_POINT + 'expensedetails';
    static SALDO_END_POINT = Api.DATA_BASE_END_POINT + 'saldo';

    static USERS_END_POINT = Api.DATA_BASE_END_POINT + 'users';
    static GROUPS_END_POINT = Api.DATA_BASE_END_POINT + 'group';
}