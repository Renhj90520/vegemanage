import { Injectable } from '@angular/core';
import { baseUrl } from '../shared/settings';
import { HttpClient } from '../shared/httpclient';
import 'rxjs/add/operator/map';

@Injectable()
export class UserService {
    constructor(private http: HttpClient) { }

    getUsers(index, perPage, condition) {
        var url = baseUrl + 'users';
        const querylist = [];
        if (index) {
            querylist.push('index=' + index);
        }
        if (perPage) {
            querylist.push('perPage=' + perPage);
        }
        if (condition.keyword) {
            querylist.push('keyword=' + condition.keyword);
        }
        if (querylist.length > 0) {
            url += '?' + querylist.join('&');
        }
        return this.http.get(baseUrl + 'users')
            .map(res => res.json());

    }

    updatePwd(pwdwrapper) {
        return this.http.put(baseUrl + 'users/changepwd', pwdwrapper)
            .map(res => res.json());
    }
}
