import { Component, OnInit } from '@angular/core';
import { MenuService } from './menu.service';
import { PagerService } from '../shared/pager.service';

@Component({
  selector: 'app-menu-list',
  templateUrl: './menu-list.component.html',
  styleUrls: ['./menu-list.component.css'],
  providers: [MenuService, PagerService]
})
export class MenuListComponent implements OnInit {

  menus = [];
  index = 1;
  count = 0;
  pages = [];

  constructor(private menuService: MenuService, private pagerService: PagerService) { }

  ngOnInit() {
    this.doLoading();
  }

  doLoading() {
    this.menuService.getAllMenus(this.index).subscribe(res => {
      if (res.state === 1) {
        this.count = res.body.count;
        this.menus = res.body.items;
        const pager = this.pagerService.getPager(this.count, this.index);
        this.pages = pager.pages;
      } else {
        alert(res.message);
      }
    }, err => {
      alert(err);
    });
  }

  onPrev() {
    if (this.index > 1) {
      this.index--;
      this.doLoading();
    }
  }

  onPageClick(page) {
    this.index = page;
    this.doLoading();
  }

  onNext() {
    if (this.index * 20 < this.count) {
      this.index++;
      this.doLoading();
    }
  }

  removeMenu(menu) {
    this.menuService.delMenu(menu.Id).subscribe(res => {
      if (res.state === 1) {
        this.menus.splice(this.menus.indexOf(menu), 1);
      } else {
        alert(res.message);
      }
    }, err => {
      alert(err);
    });
  }
}
