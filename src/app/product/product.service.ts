import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { baseUrl } from '../shared/settings';
import 'rxjs/add/operator/map';
import { PatchDoc } from '../models/patchDoc';

@Injectable()
export class ProductService {
    constructor(private http: Http) { }
    perPage: number = 20;
    addProduct(product: any) {
        return this.http.post(baseUrl + 'products', product)
            .map(res => res.json());
    }

    unshelveProduct(id: number) {
        var patchDoc = [];
        let stateOp: PatchDoc = new PatchDoc();
        stateOp.path = '/state';
        stateOp.value = "0";
        patchDoc.push(stateOp);
        return this.http.patch(baseUrl + 'products/' + id, patchDoc)
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

    updateProducts(id: number, product: any) {
        return this.http.put(baseUrl + 'products/' + id, product)
            .map(res => res.json());
    }

    removePic(picpath) {
        return this.http.delete(baseUrl + 'products/pictures/' + picpath)
            .map(res => res.json());
    }
}