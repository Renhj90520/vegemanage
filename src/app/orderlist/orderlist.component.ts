import { Component, OnInit } from '@angular/core';
import { OrderService } from './order.service';

import { PagerService } from '../shared/pager.service';

@Component({
  selector: 'app-orderlist',
  templateUrl: './orderlist.component.html',
  styleUrls: ['./orderlist.component.css'],
  providers: [OrderService, PagerService]
})
export class OrderlistComponent implements OnInit {

  constructor(private orderService: OrderService, private pagerService: PagerService) { }
  orders: any[];
  count: number = 0;
  index: number = 1;
  condition: any = {};
  pages: any[] = [];
  currOrder: any;
  reason: string;
  ngOnInit() {
    this.doLoading(this.index, this.condition);
  }
  onSearch() {
    this.index = 1;
    this.doLoading(this.index, this.condition);
  }
  doLoading(index: number, condition: any) {
    this.orderService.getOrders(this.index, this.condition)
      .subscribe(res => {
        this.count = res.body.count;
        this.orders = res.body.items;
        let pager = this.pagerService.getPager(this.count, this.index);
        this.pages = pager.pages;
        console.log(JSON.stringify(this.orders));
      });
  }

  onPrev() {
    this.index--;
    this.doLoading(this.index, this.condition);
  }

  onPageClick(page) {
    this.index = page;
    this.doLoading(this.index, this.condition);
  }

  onNext() {
    this.index++;
    this.doLoading(this.index, this.condition);
  }
  onCancelOrder(order) {
    this.currOrder = order;
  }
  onSubmitCancel() {
    this.orderService.updateOrder(this.currOrder.id, "3", this.reason)
      .subscribe(res => {
        console.log(JSON.stringify(res));
      })
    console.log(JSON.stringify(this.currOrder));
    console.log(this.reason);
  }
}
