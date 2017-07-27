import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../user/user.service';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [UserService]
})
export class HomeComponent implements OnInit {

  constructor(private fb: FormBuilder, private route: Router, private userService: UserService) {
    this.changepwd = fb.group({
      'oldpwd': ['', Validators.required],
      'passwords': fb.group({
        'newpwd': ['', Validators.required],
        'confirmpwd': ['', Validators.required]
      }, { validator: this.areEqual })
    });
  }

  pwdwrapper: any = {};
  changepwd: FormGroup;

  ngOnInit() {

  }
  onLogout() {
    localStorage.removeItem('token');
    this.route.navigate(['login']);
  }
  onChangePwd(pwdinfo, valid) {
    this.pwdwrapper.UserName = localStorage.getItem('username');
    this.pwdwrapper.OldPwd = pwdinfo.oldpwd;
    this.pwdwrapper.NewPwd = pwdinfo.passwords.newpwd;
    this.userService.updatePwd(this.pwdwrapper)
      .subscribe(res => {
        if (res.state === 1) {
          alert('修改成功');
        } else {
          alert(res.message);
        }
      }, err => {
        alert(err);
      });
  }
  areEqual(group: FormGroup) {
    const pwd = group.controls['newpwd'].value;
    const repeat = group.controls['confirmpwd'].value;

    if (pwd === repeat) {
      return null;
    }

    return { areEqual: true };
  }
}
