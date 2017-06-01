import { Component, OnInit } from '@angular/core';
import { UnitService } from '../unit/unit.service';
import { ProductService } from './product.service';
import { CategoryService } from '../category/category.service';
import { Product } from '../models/product';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FileUploader } from 'ng2-file-upload';
import { baseUrl } from '../shared/settings';
import { NgForm } from '@angular/forms';

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

  uploader: FileUploader = new FileUploader({
    url: baseUrl + 'upload',
    method: 'POST',
    itemAlias: 'upload'
  });
  constructor(private productService: ProductService,
    private unitService: UnitService,
    private categoryService: CategoryService,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit() {
    let id;
    this.route.params.forEach((params: Params) => {
      id = +params['id'];
    });
    if (id) {
      this.productService.getProducts(id).subscribe(res => {
        if (res.state == 1) {
          this.newProduct = res.body.items[0] || new Product();
        }
      },
        err => {
          alert(err);
        })
    }
    this.uploader.onAfterAddingFile = (file) => {
      file.withCredentials = false;
    }
    this.unitService.getAllUnits()
      .subscribe(res => {
        this.units = res.body;
        let unit = this.units[0];
        this.newProduct.unitId = unit.id;
        this.newProduct.unitName = unit.name;
        this.newProduct.step = unit.step;

        if (!id) {
          this.newProduct.unitId = this.units[0].id;
        }
      });
    this.categoryService.getAllCategories()
      .subscribe(res => {
        this.categories = res.body;
        if (!id) {
          this.newProduct.categoryId = this.categories[0].id;
        }
      });

  }

  onUnitChange(newValue) {
    let unit = this.units.filter(u => u.id == newValue)[0];
    this.newProduct.unitId = unit.id;
    this.newProduct.unitName = unit.name;
    this.newProduct.step = unit.step;
  }

  onSubmit(form: NgForm) {
    if (form.valid) {
      if (this.newProduct.id) {
        this.productService.updateProducts(this.newProduct.id, this.newProduct)
          .subscribe(res => {
            if (res.state == 1) {
              alert("修改成功");
              this.newProduct = new Product();
            } else {
              alert("修改失败：" + res.message);
            }
          }, err => {
            alert(err);
          })
      } else {
        this.productService.addProduct(this.newProduct)
          .subscribe(res => {
            alert("添加成功");
            this.newProduct = new Product();
          });
      }
    }
  }
  selectFileChanged() {
    let length = this.uploader.queue.length;
    if (length > 0) {
      let pic = this.uploader.queue[length - 1];
      pic.onSuccess = (res, status, headers) => {
        if (status == 200) {
          let ppp = pic;
          let result = JSON.parse(res);
          this.newProduct.pictures.push(result.body);
          ppp.remove();
        } else {
        }
      };
    }

  }
  onPicRemove(i) {
    let pic = this.uploader.queue[i];
    if (pic.isUploading) {
      this.uploader.queue[i].remove();
    }
  }

  onPicedRemove(pic) {
    let fileName = pic.path.substring(pic.path.lastIndexOf('/'));
    this.productService.removePic(fileName)
      .subscribe(res => {
        if (res.state == 1) {
          this.newProduct.pictures.splice(this.newProduct.pictures.indexOf(pic), 1);
        }
      })
  }
  onCateChange(newCate) {
    this.newProduct.categoryId = newCate;
  }

}
