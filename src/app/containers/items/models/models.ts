import { IModel } from '../../models/models';
import { SubCategory } from '../../settings/subcategories/services/subcategories.service.models';

export interface IItemModel extends IModel {
    id: string;
    groupId: string;
    name: string;
    category: SubCategory;
}