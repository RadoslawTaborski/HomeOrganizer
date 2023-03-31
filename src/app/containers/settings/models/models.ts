import { IModel } from '../../models/models';

export interface ICategory extends IModel {
  id: string;
  name: string;
}