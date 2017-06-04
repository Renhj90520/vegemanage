import { Component, OnInit } from '@angular/core';
import { PagerService } from '../shared/pager.service';
import { ProductService } from '../product/product.service';
import { Router } from '@angular/router';
import { CategoryService } from '../category/category.service';

@Component({
  selector: 'app-productlist',
  templateUrl: './productlist.component.html',
  styleUrls: ['./productlist.component.css'],
  providers: [PagerService, ProductService, CategoryService]
})
export class ProductlistComponent implements OnInit {
  products: any[];
  count: number = 0;
  index: number = 1;
  condition: any = {};
  pages: any[] = [];
  categories: any[] = [];

  units: any[] = [];
  constructor(private productService: ProductService, private categoryService: CategoryService, private pagerService: PagerService, private router: Router) { }

  ngOnInit() {
    this.categoryService.getAllCategories()
      .subscribe(res => {
        if (res.state == 1) {
          this.categories = res.body;
        } else {
          alert(res.message);
        }
      }, err => {
        alert(err);
      })
    this.doLoading(this.index, this.condition);
  }

  doLoading(index: number, condition: any) {
    this.productService.getProducts(null, index, 20, condition)
      .subscribe(res => {
        this.count = res.body.count;
        this.products = res.body.items;
        let pager = this.pagerService.getPager(this.count, this.index);
        this.pages = pager.pages;
      });
  }
  onSearch() {
    this.index = 1;
    this.doLoading(this.index, this.condition);
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
      return
    this.index++;
    this.doLoading(this.index, this.condition);
  }

  onAddProduct() {
    this.router.navigate(['product'], { replaceUrl: true });
  }

  onEdit(product) {

    this.router.navigate(['productlist/' + product.id], { replaceUrl: true });
  }
  onDelete(product) {
    this.productService.unshelveProduct(product.id)
      .subscribe(res => {
        if (res.state == 1) {
          this.products.splice(this.products.indexOf(product), 1);
        } else {
          alert(res.message);
        }
      }, err => {
        alert(err);
      });
  }
  onClear() {
    this.condition = {};
    this.onSearch();
  }
}
