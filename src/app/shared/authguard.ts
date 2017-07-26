import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { JwtHelper } from './jwthelper';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private route: Router, private jwtHelper: JwtHelper) { }

    canActivate() {
        let token = localStorage.getItem('token');
        if (token && token != 'null') {
            if (this.jwtHelper.isTokenExpired(token)) {
                localStorage.removeItem('token');
                this.route.navigate(['/login']);
                return false;
            }
            return true;
        } else {
            this.route.navigate(['/login']);
            return false;
        }
    }
}