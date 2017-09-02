import { Injectable } from '@angular/core';
import { baseUrl, authUrl } from '../shared/settings';
import { HttpClient } from '../shared/httpclient';
import 'rxjs/add/operator/map';

@Injectable()
export class UserService {
    constructor(private http: HttpClient) { }

    getUsers(index, perPage, condition) {
        let url = baseUrl + 'users';
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
        return this.http.get(url)
            .map(res => res.json());

    }

    updatePwd(pwdwrapper) {
        return this.http.put(baseUrl + 'users/changepwd', pwdwrapper)
            .map(res => res.json());
    }

    syncInfo(openid) {
        return this.http.patch(authUrl + 'updateuserinfo/' + openid, '')
            .map(res => res.json());
    }
}
