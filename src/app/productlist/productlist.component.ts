import { Component, OnInit } from '@angular/core';
import { PagerService } from '../shared/pager.service';
import { ProductService } from '../product/product.service';
import { Router } from '@angular/router';
import { CategoryService } from '../category/category.service';
import { NgForm } from '@angular/forms';
import { Product } from '../models/product';
import { UnitService } from '../unit/unit.service';
import { PatchDoc } from '../models/patchdoc';

@Component({
  selector: 'app-productlist',
  templateUrl: './productlist.component.html',
  styleUrls: ['./productlist.component.css'],
  providers: [PagerService, ProductService, CategoryService, UnitService]
})
export class ProductlistComponent implements OnInit {
  products: any[];
  count: number = 0;
  index: number = 1;
  condition: any = {};
  pages: any[] = [];
  categories: any[] = [];
  currProduct: any = {};

  units: any[] = [];
  constructor(private productService: ProductService, private unitService: UnitService, private categoryService: CategoryService, private pagerService: PagerService, private router: Router) { }

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
      });
    this.unitService.getAllUnits()
      .subscribe(res => {
        if (res.state == 1) {
          this.units = res.body;
        } else {
          alert(res.message);
        }
      }, err => {
        alert(err);
      });
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
    var patchDoc = [];
    let stateOp: PatchDoc = new PatchDoc();
    stateOp.path = '/state';
    stateOp.value = "0";
    patchDoc.push(stateOp);
    this.productService.patchProduct(product.id, patchDoc)
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

  onQuickEdit(product) {
    this.currProduct = product;
  }

  onUnitChange(newValue) {
    let unit = this.units.filter(u => u.id == newValue)[0];
    this.currProduct.unitId = unit.id;
    this.currProduct.unitName = unit.name;
    this.currProduct.step = unit.step;
  }

  onSubmit(form: NgForm) {
    if (form.valid) {
      var patchDoc = [];
      let priceOp: PatchDoc = new PatchDoc();
      priceOp.path = '/price';
      priceOp.value = this.currProduct.price;
      patchDoc.push(priceOp);
      let nameOp: PatchDoc = new PatchDoc();
      nameOp.path = '/name';
      nameOp.value = this.currProduct.name;
      patchDoc.push(nameOp);
      let unitIdOp = new PatchDoc();
      unitIdOp.path = '/unitId';
      unitIdOp.value = this.currProduct.unitId;
      patchDoc.push(unitIdOp);
      let unitNameOp = new PatchDoc();
      unitNameOp.path = '/unitName';
      unitNameOp.value = this.currProduct.unitName;
      patchDoc.push(unitNameOp);
      let stepOp = new PatchDoc();
      stepOp.path = '/step';
      stepOp.value=this.currProduct.step;
      patchDoc.push(stepOp);
      let categoryIdOp = new PatchDoc();
      categoryIdOp.path = '/categoryId';
      categoryIdOp.value = this.currProduct.categoryId;
      patchDoc.push(categoryIdOp);
      this.productService.patchProduct(this.currProduct.id, patchDoc)
        .subscribe(res => {
          if (res.state == 1) {
            alert("修改成功");
            this.currProduct = new Product();
          } else {
            alert("修改失败：" + res.message);
          }
        }, err => {
          alert(err);
        })
    }
  }
  onCateChange(newCate) {
    this.currProduct.categoryId = newCate;
  }
}
