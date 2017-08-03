import { Component, OnInit } from '@angular/core';
// import { PagerService } from '../shared/pager.service';
import { ProductService } from '../product/product.service';
import { Router } from '@angular/router';
import { CategoryService } from '../category/category.service';
import { NgForm } from '@angular/forms';
import { Product } from '../models/product';
import { UnitService } from '../unit/unit.service';
import { PatchDoc } from '../models/patchdoc';
import { env } from '../shared/settings';

@Component({
  selector: 'app-productlist',
  templateUrl: './productlist.component.html',
  styleUrls: ['./productlist.component.css'],
  providers: [ProductService, CategoryService, UnitService] // PagerService,
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
  constructor(private productService: ProductService,
    private unitService: UnitService,
    private categoryService: CategoryService,
    // private pagerService: PagerService,
    private router: Router) { }

  ngOnInit() {
    this.categoryService.getAllCategories()
      .subscribe(res => {
        if (res.state === 1) {
          this.categories = res.body;
          if (this.categories.length > 0) {
            this.condition.category = this.categories[0].Id;
            this.doLoading(this.index, this.condition);
          }
        } else {
          alert(res.message);
        }
      }, err => {
        alert(err);
      });
    this.unitService.getAllUnits()
      .subscribe(res => {
        if (res.state === 1) {
          this.units = res.body;
        } else {
          alert(res.message);
        }
      }, err => {
        alert(err);
      });
  }

  doLoading(index: number, condition: any) {
    this.productService.getProducts(null, null, null, condition)
      .subscribe(res => {
        if (res.state === 1) {
          this.count = res.body.count;
          this.products = res.body.items;
          // const pager = this.pagerService.getPager(this.count, this.index);
          // this.pages = pager.pages;
        } else {
          alert(res.message);
        }
      }, err => {
        alert(err);
      });
  }
  onSearch() {
    this.index = 1;
    this.doLoading(this.index, this.condition);
  }

  // onPrev() {
  //   if (this.index <= 1) {
  //     return;
  //   }
  //   this.index--;
  //   this.doLoading(this.index, this.condition);
  // }
  // onPageClick(page) {
  //   this.index = page;
  //   this.doLoading(this.index, this.condition);
  // }
  // onNext() {
  //   if (this.index * 20 >= this.count) {
  //     return;
  //   }
  //   this.index++;
  //   this.doLoading(this.index, this.condition);
  // }

  onAddProduct() {
    this.router.navigate(['product'], { replaceUrl: true });
  }

  onEdit(product) {

    this.router.navigate(['productlist/' + product.Id], { replaceUrl: true });
  }
  onDelete(product) {
    if (env === 'node') {
      this.productService.updateProducts(product.Id, { State: 0 })
        .subscribe(res => {
          if (res.state === 1) {
            this.products[this.products.indexOf(product)].Stete = 0;
          } else {
            alert(res.message);
          }
        }, err => {
          alert(err);
        });
    } else {
      const patchDoc = [];
      const stateOp: PatchDoc = new PatchDoc();
      stateOp.path = '/State';
      stateOp.value = '0';
      patchDoc.push(stateOp);
      this.productService.patchProduct(product.Id, patchDoc)
        .subscribe(res => {
          if (res.state === 1) {
            this.products[this.products.indexOf(product)].State = 0;
          } else {
            alert(res.message);
          }
        }, err => {
          alert(err);
        });
    }
  }
  onSale(product) {
    const patchDoc = [];
    const stateOp: PatchDoc = new PatchDoc();
    stateOp.path = '/State';
    stateOp.value = '1';
    patchDoc.push(stateOp);
    this.productService.patchProduct(product.Id, patchDoc)
      .subscribe(res => {
        if (res.state === 1) {
          this.products[this.products.indexOf(product)].State = 1;
        } else {
          alert(res.message);
        }
      }, err => {
        alert(err);
      });
  }

  onClear() {
    const cate = this.condition.category;
    this.condition = {};
    this.condition.category = cate;
    this.onSearch();
  }

  onQuickEdit(product) {
    this.currProduct = product;
  }

  onUnitChange(newValue) {
    const unit = this.units.filter(u => u.Id == newValue)[0];
    this.currProduct.UnitId = unit.Id;
    this.currProduct.UnitName = unit.Name;
    this.currProduct.Step = unit.Step;
  }

  onSubmit(form: NgForm) {
    if (form.valid) {
      if (env === 'node') {
        this.productService.updateProducts(this.currProduct.Id, this.currProduct)
          .subscribe(res => {
            if (res.state === 1) {
              alert('修改成功');
              this.currProduct = new Product();
            } else {
              alert(res.message);
            }
          }, err => {
            alert(err);
          });
      } else {
        const patchDoc = [];
        const priceOp: PatchDoc = new PatchDoc();
        priceOp.path = '/Price';
        priceOp.value = this.currProduct.Price;
        patchDoc.push(priceOp);
        const nameOp: PatchDoc = new PatchDoc();
        nameOp.path = '/Name';
        nameOp.value = this.currProduct.Name;
        patchDoc.push(nameOp);
        const unitIdOp = new PatchDoc();
        unitIdOp.path = '/UnitId';
        unitIdOp.value = this.currProduct.UnitId;
        patchDoc.push(unitIdOp);
        const unitNameOp = new PatchDoc();
        unitNameOp.path = '/UnitName';
        unitNameOp.value = this.currProduct.UnitName;
        patchDoc.push(unitNameOp);
        const stepOp = new PatchDoc();
        stepOp.path = '/Step';
        stepOp.value = this.currProduct.Step;
        patchDoc.push(stepOp);
        const categoryIdOp = new PatchDoc();
        categoryIdOp.path = '/CategoryId';
        categoryIdOp.value = this.currProduct.CategoryId;
        patchDoc.push(categoryIdOp);
        this.productService.patchProduct(this.currProduct.Id, patchDoc)
          .subscribe(res => {
            if (res.state === 1) {
              alert('修改成功');
              this.currProduct = new Product();
            } else {
              alert('修改失败：' + res.message);
            }
          }, err => {
            alert(err);
          });
      }
    }
  }
  onCateChange(newCate) {
    this.currProduct.CategoryId = newCate;
  }

  onCateConditionChange(cate) {
    this.index = 1;
    this.condition.category = cate;
    this.doLoading(this.index, this.condition);
  }
  onUp(product) {
    const index = this.products.indexOf(product);
    if (index === 0) {
      return;
    }

    const pro1 = this.products[index];
    const pro2 = this.products[index - 1];
    this.productService.reorder(pro1.Id, pro2.Id)
      .subscribe(res => {
        if (res.state === 1) {
          this.products.splice(index, 1);
          this.products.splice(index - 1, 0, pro1);
        } else {
          alert(res.message);
        }
      }, err => {
        alert(err);
      });

  }

  onDown(product) {
    const index = this.products.indexOf(product);

    if (index === this.products.length) {
      return;
    }

    const pro1 = this.products[index];
    const pro2 = this.products[index + 1];

    this.productService.reorder(pro1.Id, pro2.Id)
      .subscribe(res => {
        if (res.state === 1) {
          this.products.splice(index + 1, 1);
          this.products.splice(index, 0, pro2);
        } else {
          alert(res.message);
        }
      }, err => {
        alert(err);
      });
  }
}
