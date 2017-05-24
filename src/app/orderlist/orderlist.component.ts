///<reference path="../../../typings/globals/jquery/index.d.ts" />
import { Component, OnInit } from '@angular/core';
import { OrderService } from './order.service';

import { PagerService } from '../shared/pager.service';
declare var $: JQueryStatic;
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
    this.condition.noshowRemove = true;
    this.orderService.getOrders(this.index, this.condition)
      .subscribe(res => {
        this.count = res.body.count;
        this.orders = res.body.items;
        let pager = this.pagerService.getPager(this.count, this.index);
        this.pages = pager.pages;
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
    this.currOrder.state = "2";
    this.currOrder.reason = this.reason;
    this.orderService.updateOrder(this.currOrder)
      .subscribe(res => {
        if (res.state == 1) {
          $('.glyphicon.glyphicon-remove.operator').click();
        }
      })
  }

  onRemoveOrder(order) {
    if (confirm('确认删除该订单吗？')) {
      this.orderService.removeOrder(order.id)
        .subscribe(res => {
          if (res.state == 1) {
            this.orders.splice(this.orders.indexOf(order), 1);
          }
        })
    }
  }
}
