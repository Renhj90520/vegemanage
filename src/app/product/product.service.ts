import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { baseUrl } from '../shared/settings';
import 'rxjs/add/operator/map';

@Injectable()
export class ProductService {
    constructor(private http: Http) { }
    perPage: number = 20;
    addProduct(product: any) {
        return this.http.post(baseUrl + 'products', product)
            .map(res => res.json());
    }

    unshelveProduct(id: number) {
        return this.http.put(baseUrl + 'products/' + id, { state: 0 })
            .map(res => res.json());
    }

    getProducts(id?: number, index?: number, perPage?: number, condition?: any) {
        let url = baseUrl + 'products';
        var conditions = [];
        if (index) {
            conditions.push('index=' + index);
        }
        if (perPage) {
            conditions.push("perPage=" + perPage);
        }

        if (condition.category && condition.category != 0) {
            conditions.push('category=' + condition.category);
        }
        if (condition.name) {
            conditions.push('name=' + condition.name);
        }
        if (conditions.length > 0) {

        }
        return this.http.get(url)
            .map(res => res.json());
    }

    updateProducts(id: number, product: any) {
        return this.http.put(baseUrl + 'products/' + id, product)
            .map(res => res.json());
    }
}