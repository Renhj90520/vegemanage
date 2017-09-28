import { Component, OnInit } from '@angular/core';
import { UnitService } from '../unit/unit.service';
import { ProductService } from './product.service';
import { CategoryService } from '../category/category.service';
import { Product } from '../models/product';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FileUploader } from 'ng2-file-upload';
import { baseUrl } from '../shared/settings';
import { NgForm } from '@angular/forms';
import { Headers } from 'ng2-file-upload';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
  providers: [ProductService, CategoryService, UnitService]
})
export class ProductComponent implements OnInit {
  newProduct: Product = new Product();
  units: any[] = [];
  categories: any[] = [];

  uploader: FileUploader;
  constructor(private productService: ProductService,
    private unitService: UnitService,
    private categoryService: CategoryService,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.uploader = new FileUploader({
      url: baseUrl + 'upload',
      method: 'POST',
      itemAlias: 'upload',
    });
    this.uploader.authToken = 'Bearer ' + localStorage.getItem('token');

    let id;
    this.route.params.forEach((params: Params) => {
      id = +params['id'];
    });
    if (id) {
      this.productService.getProduct(id).subscribe(res => {
        if (res.state === 1) {
          this.newProduct = res.body || new Product();
        }
      },
        err => {
          alert(err);
        });
    } else {
      this.newProduct.Limit = 0;
    }
    this.uploader.onAfterAddingFile = (file) => {
      file.withCredentials = false;
    }
    this.unitService.getAllUnits()
      .subscribe(res => {
        this.units = res.body;
        const unit = this.units[0];
        if (!id) {
          this.newProduct.UnitId = unit.Id;
          this.newProduct.UnitName = unit.Name;
          this.newProduct.Step = unit.Step;
        }
      });
    this.categoryService.getAllCategories()
      .subscribe(res => {
        this.categories = res.body;
        if (!id) {
          this.newProduct.CategoryId = this.categories[0].Id;
        }
      });

  }

  onUnitChange(newValue) {
    const unit = this.units.filter(u => u.Id == newValue)[0];
    this.newProduct.UnitId = unit.Id;
    this.newProduct.UnitName = unit.Name;
    this.newProduct.Step = unit.Step;
  }

  onSubmit(form: NgForm) {
    if (form.valid) {
      if (this.newProduct.Id) {
        this.productService.updateProducts(this.newProduct.Id, this.newProduct)
          .subscribe(res => {
            if (res.state === 1) {
              alert('修改成功');
              this.newProduct = new Product();
            } else {
              alert('修改失败：' + res.message);
            }
          }, err => {
            alert(err);
          });
      } else {
        this.productService.addProduct(this.newProduct)
          .subscribe(res => {
            alert('添加成功');
            this.newProduct = new Product();
          });
      }
    }
  }
  selectFileChanged() {
    const length = this.uploader.queue.length;
    if (length > 0) {
      const pic = this.uploader.queue[length - 1];
      pic.onSuccess = (res, status, headers) => {
        if (status === 200) {
          const ppp = pic;
          const result = JSON.parse(res);
          this.newProduct.Pictures.push(result.body);
          ppp.remove();
        } else {
        }
      };
    }

  }
  onPicRemove(i) {
    const pic = this.uploader.queue[i];
    if (pic.isUploading) {
      this.uploader.queue[i].remove();
    }
  }

  onPicedRemove(pic) {
    const fileName = pic.Path.substring(pic.Path.lastIndexOf('/'));
    this.productService.removePic(fileName)
      .subscribe(res => {
        if (res.state === 1) {
          this.newProduct.Pictures.splice(this.newProduct.Pictures.indexOf(pic), 1);
        }
      });
  }
  onCateChange(newCate) {
    this.newProduct.CategoryId = newCate;
  }

}
