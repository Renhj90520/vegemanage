/////<reference path="../../../typings/globals/jquery/index.d.ts" />
import { Component, OnInit } from '@angular/core';
import { OrderService } from './order.service';

import { PagerService } from '../shared/pager.service';
import { PatchDoc } from '../models/patchdoc';
import { MathUtil } from '../shared/util';

// declare var $: JQueryStatic;
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
  reason: string = "超出配送范围，谢谢关注。";
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
        if (res.state == 1) {
          this.count = res.body.count;
          this.orders = res.body.items;
          this.orders.forEach(order => {
            let total = order.Products.map(p => MathUtil.mutiple(p.Price, p.Count)).reduce((x, y) => MathUtil.add(x, y));
            order.total = MathUtil.add(total, order.DeliveryCharge);
            order.Products.forEach(p => {
              p.cost = MathUtil.mutiple(p.Count, p.Price);
            });
          })
          let pager = this.pagerService.getPager(this.count, this.index);
          this.pages = pager.pages;
        } else {
          alert(res.message);
        }
      }, err => {
        alert(err);
      });
  }

  onPrev() {
    if (this.index <= 1)
      return;
    this.index--;
    this.doLoading(this.index, this.condition);
  }

  onPageClick(page) {
    this.index = page;
    this.doLoading(this.index, this.condition);
  }

  onNext() {
    if (this.index * 20 >= this.count)
      return;
    this.index++;
    this.doLoading(this.index, this.condition);
  }
  onCancelOrder(order) {
    this.currOrder = order;
  }
  onSubmitCancel() {

    var patchDoc = [];
    let stateOp: PatchDoc = new PatchDoc();
    stateOp.path = '/state';
    stateOp.value = "2";
    patchDoc.push(stateOp);
    let reasonOp: PatchDoc = new PatchDoc();
    reasonOp.path = '/cancelreason';
    reasonOp.value = this.reason;
    patchDoc.push(reasonOp);
    let canceltimeOp = new PatchDoc();
    canceltimeOp.path = "canceltime";
    canceltimeOp.value = new Date();
    patchDoc.push(canceltimeOp);

    this.orderService.updateOrder(this.currOrder.id, patchDoc)
      .subscribe(res => {
        if (res.state == 1) {
          this.currOrder.state = 2;
          this.currOrder.reason = this.reason;
          // $('.glyphicon.glyphicon-remove.operator').click();
        } else {
          alert(res.message);
        }
      }, err => {
        alert(err);
      })
  }

  onRemoveOrder(order) {
    if (confirm('确认删除该订单吗？')) {
      this.orderService.removeOrder(order.id)
        .subscribe(res => {
          if (res.state == 1) {
            this.orders.splice(this.orders.indexOf(order), 1);
          } else {
            alert(res.message);
          }
        }, err => {
          alert(err);
        })
    }
  }

  onComplete(order) {
    let patchDoc = [];
    let stateOp: PatchDoc = new PatchDoc();
    stateOp.path = "/state";
    stateOp.value = "3";
    patchDoc.push(stateOp);
    let finishTimeOp: PatchDoc = new PatchDoc();
    finishTimeOp.path = "finishtime";
    finishTimeOp.value = new Date();
    patchDoc.push(finishTimeOp);
    this.orderService.updateOrder(order.id, patchDoc)
      .subscribe(res => {
        if (res.state == 1) {
          order.state = 3;
        }
        else
          alert(res.message);
      },
      err => alert(err));
  }

  onSend(order) {
    let pathDoc = [];
    let stateOp: PatchDoc = new PatchDoc();
    stateOp.path = "/state";
    stateOp.value = "1";
    pathDoc.push(stateOp);
    this.orderService.updateOrder(order.id, pathDoc)
      .subscribe(res => {
        if (res.state == 1) {
          order.state = 1;
        } else {
          alert(res.message);
        }
      }, err => {
        alert(err);
      });
  }
}
