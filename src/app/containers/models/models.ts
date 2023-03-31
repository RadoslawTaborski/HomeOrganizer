export interface IModel {
  createTime: string;
  updateTime: string;
  deleteTime: string;
}

export type Methods = 'add' | 'remove' | 'update' | 'more';

export interface Action {
  type: Methods
  data: any
}

export interface Filter {
  pageNumber: number,
  pageSize: number,
  orderBy: string
}