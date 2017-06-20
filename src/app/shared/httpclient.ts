import { Http, Headers } from '@angular/http';
import { Injectable } from '@angular/core';

@Injectable()
export class HttpClient {
    constructor(private http: Http) { }

    get(url) {
        let headers = new Headers();
        headers.append('Access-Control-Allow-Origin', '*');
        this.appendAuthorization(headers);
        return this.http.get(url, { headers: headers });
    }

    post(url, data) {
        let headers = new Headers();
        headers.append('Access-Control-Allow-Origin', '*');
        this.appendAuthorization(headers);
        return this.http.post(url, data, { headers: headers });
    }

    delete(url) {
        let headers = new Headers();
        headers.append('Access-Control-Allow-Origin', '*');
        this.appendAuthorization(headers);
        return this.http.delete(url, { headers: headers });
    }

    put(url, data) {
        let headers = new Headers();
        headers.append('Access-Control-Allow-Origin', '*');
        this.appendAuthorization(headers);
        return this.http.put(url, data, { headers: headers });
    }

    patch(url, data) {
        let headers = new Headers();
        headers.append('Access-Control-Allow-Origin', '*');
        this.appendAuthorization(headers);
        return this.http.patch(url, data, { headers: headers });
    }
    private appendAuthorization(headers) {
        let token = localStorage.getItem('token');
        if (token) {
            headers.append('Authorization', 'Bearer ' + token);
        }
    }
}