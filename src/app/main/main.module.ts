import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
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
import { MyDatePipe } from '../shared/mydate.pipe';
import { HttpClient } from '../shared/httpclient';

@NgModule({
  imports: [
    CommonModule,
    FileUploadModule,
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule
  ],
  declarations: [
    CategoryComponent,
    UnitComponent,
    ProductComponent,
    ProductlistComponent,
    OrderlistComponent,
    UserComponent,
    AdminComponent,
    OrderPipe,
    ProductPipe,
    MyDatePipe,
    HomeComponent
  ],
  bootstrap: [HomeComponent],
  providers: [HttpClient]
})
export class MainModule { }
