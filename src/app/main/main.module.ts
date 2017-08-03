import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';

import { CategoryComponent } from '../category/category.component';
import { UnitComponent } from '../unit/unit.component';
import { ProductComponent } from '../product/product.component';
import { ProductlistComponent } from '../productlist/productlist.component';
import { OrderlistComponent } from '../orderlist/orderlist.component';
import { UserComponent } from '../user/user.component';
import { AdminComponent } from '../admin/admin.component';
import { HomeComponent } from './home.component';

import { FileUploadModule } from 'ng2-file-upload';
import { OrderPipe } from '../shared/orderstate.pipe';
import { ProductPipe } from '../shared/productstate.pipe';
import { SexPipe } from '../shared/sex.pipe';
import { MyDatePipe } from '../shared/mydate.pipe';
import { CateStatePipe } from '../shared/catestate.pipe';
import { HttpClient } from '../shared/httpclient';
import { DayPipe } from '../shared/day.pipe';
import { CouponComponent } from '../coupon/coupon.component';

@NgModule({
  imports: [
    CommonModule,
    FileUploadModule,
    BrowserModule,
    FormsModule,
    HttpModule,
    ReactiveFormsModule,
    RouterModule
  ],
  declarations: [
    CategoryComponent,
    UnitComponent,
    ProductComponent,
    ProductlistComponent,
    OrderlistComponent,
    UserComponent,
    CouponComponent,
    AdminComponent,
    OrderPipe,
    CateStatePipe,
    SexPipe,
    ProductPipe,
    DayPipe,
    MyDatePipe,
    HomeComponent
  ],
  bootstrap: [HomeComponent],
  providers: [HttpClient]
})
export class MainModule { }
