import { Component, OnInit } from '@angular/core';
import { UserService } from './user.service';
import { PagerService } from '../shared/pager.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
  providers: [UserService, PagerService]
})
export class UserComponent implements OnInit {
  users = [];
  count: number = 0;
  index: number = 1;
  condition: any = {};
  pages: any[] = [];

  constructor(private userService: UserService,
    private pagerService: PagerService) { }

  ngOnInit() {
    this.doLoading();
  }

  onSearch() {
    this.index = 1;
    this.doLoading();
  }

  onPrev() {
    if (this.index === 1) {
      return;
    }

    this.index--;
    this.doLoading();
  }

  onPageClick(page) {
    this.index = page;
    this.doLoading();
  }

  onNext() {
    if (this.index * 20 >= this.count) {
      return;
    }
    this.index++;
    this.doLoading();
  }

  doLoading() {
    this.userService.getUsers(this.index, 20, this.condition)
      .subscribe(res => {
        if (res.state === 1) {
          this.count = res.body.count;
          this.users = res.body.items;
          const pager = this.pagerService.getPager(this.count, this.index);
          this.pages = pager.pages;
        } else {
          alert(res.message);
        }
      }, err => {
        alert(err);
      });
  }
  syncInfo(user) {
    this.userService.syncInfo(user.OpenId)
      .subscribe(res => {
        if (res.state === 1) {
          const index = this.users.indexOf(user);
          this.users.splice(index, 1, res.body);
        } else {
          alert(res.message);
        }
      }, err => {
        alert(err);
      });
  }
}
