import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';

import { routing } from './routing';
import { CategoryComponent } from './category/category.component';
import { UnitComponent } from './unit/unit.component';
import { ProductComponent } from './product/product.component';
import { ProductlistComponent } from './productlist/productlist.component';
import { OrderlistComponent } from './orderlist/orderlist.component';
import { UserComponent } from './user/user.component';
import { AdminComponent } from './admin/admin.component';
import { LoginComponent } from './login/login.component';

import { FileUploadModule } from 'ng2-file-upload';
import { OrderPipe } from './shared/orderstate.pipe';

@NgModule({
  declarations: [
    AppComponent,
    CategoryComponent,
    UnitComponent,
    ProductComponent,
    ProductlistComponent,
    OrderlistComponent,
    UserComponent,
    AdminComponent,
    LoginComponent,
    OrderPipe
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    routing,
    FileUploadModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
