import { Observable } from 'rxjs';

export interface HttpServiceModel {
    fetch(filters?: { [key: string]: any }): Promise<ResponseData>;
    get(id: string, deep?: number): Promise<any>;
    add(item): Promise<ResponseData>;
    update(item): Promise<ResponseData>;
    remove(id: string): Promise<ResponseData>;
}

export interface ResponseData {
    data: any[];
    total: number;
    message: string;
    error: string;
}
