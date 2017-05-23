import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { CategoryComponent } from './category/category.component';
import { OrderlistComponent } from './orderlist/orderlist.component';
import { ProductComponent } from './product/product.component';
import { ProductlistComponent } from './productlist/productlist.component';
import { UnitComponent } from './unit/unit.component';
import { UserComponent } from './user/user.component';
import { LoginComponent } from './login/login.component';

export const routing = RouterModule.forRoot([
    { path: '', component: OrderlistComponent },
    { path: 'category', component: CategoryComponent },
    { path: 'orderlist', component: OrderlistComponent },
    { path: 'productlist', component: ProductlistComponent },
    { path: 'productlist/:id', component: ProductComponent },
    { path: 'unit', component: UnitComponent },
    { path: 'product', component: ProductComponent },
    { path: 'user', component: UserComponent },
    { path: 'login', component: LoginComponent }
]);