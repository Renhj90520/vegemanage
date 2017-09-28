import { HttpClient } from '../shared/httpclient';
import { baseUrl } from '../shared/settings';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

@Injectable()
export class MenuService {
    perPage = 20;

    constructor(private http: HttpClient) { }

    getAllMenus(index?: number, perPage: number = this.perPage) {
        let url = baseUrl + 'menus/menulist';
        if (index) {
            url += '?index=' + index + '&perPage=' + perPage;
        }
        return this.http.get(url).map(res => res.json());
    }

    getMenu(id) {
        return this.http.get(baseUrl + 'menus/' + id).map(res => res.json());
    }

    delMenu(id) {
        return this.http.delete(baseUrl + 'menus/' + id).map(res => res.json());
    }

    addMenu(menu) {
        return this.http.post(baseUrl + 'menus', menu).map(res => res.json());
    }
}
