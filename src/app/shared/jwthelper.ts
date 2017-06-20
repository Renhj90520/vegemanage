import { Injectable } from '@angular/core';

@Injectable()
export class JwtHelper {
    private b64decode(str: string): string {

        let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

        let output: string = '';

        str = String(str).replace(/=+$/, '');
        if (str.length % 4 == 1) {
            throw new Error("'atob' failed: The string to be decoded is not correctly encoded.");
        }

        for (
            let bc: number = 0, bs: any, buffer: any, idx: number = 0;
            buffer = str.charAt(idx++);
            ~buffer && (bs = bc % 4 ? bs * 64 + buffer : buffer, bc++ % 4) ? output += String.fromCharCode(255 & bs >> (-2 * bc & 6)) : 0
        ) {
            buffer = chars.indexOf(buffer);
        }

        return output;
    }
    private b64DecodeUnicode(str) {
        return decodeURIComponent(Array.prototype.map.call(this.b64decode(str), (c) => {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
    }

    public urlBase64Decode(str: string): string {
        let output = str.replace(/-/g, '+').replace(/_/g, '/');
        switch (output.length % 4) {
            case 0: break;
            case 2: { output += '=='; break; }
            case 3: { output += '='; break; }
            default:
                throw 'Illegal base64url string';
        }
        return this.b64DecodeUnicode(output);
    }
    public decodeToken(token: string): any {
        let parts = token.split('.');

        if (parts.length !== 3) {
            throw new Error('Jwt must have 3 parts');
        }

        let decoded = this.urlBase64Decode(parts[1]);

        if (!decoded) {
            throw new Error('Can not decode the token');
        }

        return JSON.parse(decoded);
    }

    public getTokenExpirationDate(token: string): Date {
        let decoded: any;
        decoded = this.decodeToken(token);

        if (!decoded.hasOwnProperty('exp')) {
            return null;
        }

        let date = new Date(0);
        date.setUTCSeconds(decoded.exp);

        return date;
    }

    public isTokenExpired(token: string, offsetSeconds?: number): boolean {

        let date = this.getTokenExpirationDate(token);

        offsetSeconds = offsetSeconds || 0;

        if (date == null) {
            return false;
        }
        return !(date.valueOf() > (new Date().valueOf() + (offsetSeconds * 1000)));
    }
}