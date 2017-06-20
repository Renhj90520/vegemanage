import { RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './main/home.component';
import { CategoryComponent } from './category/category.component';
import { OrderlistComponent } from './orderlist/orderlist.component';
import { ProductComponent } from './product/product.component';
import { ProductlistComponent } from './productlist/productlist.component';
import { UnitComponent } from './unit/unit.component';
import { UserComponent } from './user/user.component';
import { AuthGuard } from './shared/authguard';

export const routing = RouterModule.forRoot([
    { path: 'login', component: LoginComponent },
    {
        path: '', component: HomeComponent, children: [
            { path: '', component: OrderlistComponent },
            { path: 'category', component: CategoryComponent },
            { path: 'orderlist', component: OrderlistComponent },
            { path: 'productlist', component: ProductlistComponent },
            { path: 'productlist/:id', component: ProductComponent },
            { path: 'unit', component: UnitComponent },
            { path: 'product', component: ProductComponent },
            { path: 'user', component: UserComponent },
            { path: "home", component: HomeComponent, outlet: "primary" }
        ], canActivate: [AuthGuard]
    }
])