import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { baseUrl } from '../shared/settings';
import { Category } from '../models/category';
import 'rxjs/add/operator/map';

@Injectable()
export class CategoryService {

    constructor(private http: Http) { }

    addCategory(category: Category) {
        return this.http.post(baseUrl + 'categories', category)
            .map(res => res.json());
    }

    deleteCategory(id: number) {
        return this.http.delete(baseUrl + 'categories/' + id)
            .map(res => res.json());
    }

    getAllCategories() {
        return this.http.get(baseUrl + 'categories')
            .map(res => res.json());
    }

    
}