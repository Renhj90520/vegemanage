import { Component, OnInit } from '@angular/core';
import { LoginService } from './login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [LoginService]
})
export class LoginComponent implements OnInit {

  userName: string;
  password: string;
  rememberPwd: boolean = true;
  constructor(private loginService: LoginService, private route: Router) { }

  ngOnInit() {
    this.userName = localStorage.getItem('username');
    this.password = localStorage.getItem('pwd');
  }

  onLogin() {
    this.loginService.login(this.userName, this.password).subscribe(res => {
      if (res.state == 1) {
        localStorage.setItem('username', this.userName);
        if (this.rememberPwd) {
          localStorage.setItem('pwd', this.password);
        } else {
          localStorage.removeItem('pwd');
        }
        localStorage.setItem('token', res.body);
        this.route.navigate(['']);
      } else {
        alert(res.message);
      }
    }, err => { alert(err) });
  }

}
