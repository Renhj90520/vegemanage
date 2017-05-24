import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { baseUrl } from '../shared/settings';
import 'rxjs/add/operator/map';

@Injectable()
export class OrderService {
    perPage: number = 20;

    constructor(private http: Http) { }

    getOrders(index: number, condition) {
        var url = baseUrl + 'orders?';
        url += 'index=' + index;
        url += '&perPage=' + this.perPage;
        if (condition.keyword) {
            url += '&keyword=' + condition.keyword;
        }
        if (condition.begin) {
            url += '&begin=' + condition.begin;
        }
        if (condition.end) {
            url += '&end=' + condition.end;
        }
        if (condition.noshowRemove) {
            url += '&noshowRemove=true'
        }
        return this.http.get(url)
            .map(res => res.json());
    }

    updateOrder(id, order) {
        return this.http.patch(baseUrl + 'orders/' + id, order)
            .map(res => res.json());
    }

    removeOrder(id: number) {
        return this.http.delete(baseUrl + 'orders/' + id)
            .map(res => res.json());
    }
}