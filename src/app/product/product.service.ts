import { Injectable } from '@angular/core';
import { HttpClient } from '../shared/httpclient';
import { baseUrl } from '../shared/settings';
import 'rxjs/add/operator/map';

@Injectable()
export class ProductService {
    constructor(private http: HttpClient) { }
    perPage: number = 20;
    addProduct(product: any) {
        return this.http.post(baseUrl + 'products', product)
            .map(res => res.json());
    }

    patchProduct(id: number, patchDoc: any[]) {

        return this.http.patch(baseUrl + 'products/' + id, patchDoc)
            .map(res => res.json());
    }

    getProducts(id?: number, index?: number, perPage?: number, condition?: any, state?: number) {
        let url = baseUrl + 'products';
        const conditions = [];
        if (index) {
            conditions.push('index=' + index);
        }
        if (perPage) {
            conditions.push('perPage=' + perPage);
        }

        if (condition && condition.category && condition.category != 0) {
            conditions.push('category=' + condition.category);
        }

        if (condition && condition.name) {
            conditions.push('name=' + condition.name);
        }

        if (id) {
            url += '/' + id;
        }

        if (condition && conditions.length > 0) {
            url += '?' + conditions.join('&');
        }

        return this.http.get(url)
            .map(res => res.json());
    }

    getProduct(id) {
        return this.http.get(baseUrl + 'products/' + id)
            .map(res => res.json());
    }

    updateProducts(id: number, product: any) {
        return this.http.put(baseUrl + 'products/' + id, product)
            .map(res => res.json());
    }

    removePic(picpath) {
        return this.http.delete(baseUrl + 'products/pictures' + picpath)
            .map(res => res.json());
    }

    reorder(id1, id2) {
        return this.http.patch(baseUrl + 'products/exchange/' + id1 + '/' + id2, null)
            .map(res => res.json());
    }
}