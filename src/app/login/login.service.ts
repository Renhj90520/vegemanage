import { Injectable } from '@angular/core';
import { authUrl } from '../shared/settings';
import 'rxjs/add/operator/map';
import { HttpClient } from '../shared/httpclient';

@Injectable()
export class LoginService {
    constructor(private http: HttpClient) { }

    login(userName: string, password: string) {
        return this.http.post(authUrl + 'login', { UserName: userName, Password: password })
            .map(res => res.json());
    }
}