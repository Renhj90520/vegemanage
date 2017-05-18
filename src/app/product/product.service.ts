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

    getProducts(index: number, condition: any) {
        let url = baseUrl + 'products?';
        url += 'index=' + index;
        url += '&perPage=' + this.perPage;
        if (condition.category && condition.category != 0) {
            url += '&category=' + condition.category;
        }
        if (condition.name) {
            url += '&name=' + condition.name;
        }
        return this.http.get(url)
            .map(res => res.json());
    }

    updateProducts(id: number, product: any) {
        return this.http.put(baseUrl + 'products/' + id, product)
            .map(res => res.json());
    }
}