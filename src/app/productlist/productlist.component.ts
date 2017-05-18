import { Component, OnInit } from '@angular/core';
import { PagerService } from '../shared/pager.service';
import { ProductService } from '../product/product.service';

@Component({
  selector: 'app-productlist',
  templateUrl: './productlist.component.html',
  styleUrls: ['./productlist.component.css'],
  providers: [PagerService, ProductService]
})
export class ProductlistComponent implements OnInit {
  products: any[];
  count: number = 0;
  index: number = 1;
  condition: any = {};
  pages: any[] = [];

  units: any[] = [];
  constructor(private productService: ProductService, private pagerService: PagerService) { }

  ngOnInit() {
    this.doLoading(this.index, this.condition);
  }

  doLoading(index: number, condition: any) {
    this.productService.getProducts(index, condition)
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
    this.index--;
    this.doLoading(this.index, this.condition);
  }
  onPageClick(page) {
    this.index = page;
    this.doLoading(this.index, this.condition);
  }
  onNext() {
    this.index++;
    console.log('------------>index:' + this.index);
    this.doLoading(this.index, this.condition);
  }

  onAddProduct() {

  }
}
