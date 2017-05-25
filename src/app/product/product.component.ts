import { Component, OnInit } from '@angular/core';
import { UnitService } from '../unit/unit.service';
import { ProductService } from './product.service';
import { CategoryService } from '../category/category.service';
import { Product } from '../models/product';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FileUploader } from 'ng2-file-upload';
import { baseUrl } from '../shared/settings';

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
    this.unitService.getAllUnits()
      .subscribe(res => {
        this.units = res.body;
        let unit = this.units[0];
        this.newProduct.unitName = unit.name;
        this.newProduct.step = unit.step;
      });
    this.categoryService.getAllCategories()
      .subscribe(res => {
        this.categories = res.body;
      });
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
          console.log(err);
        })
    }
  }

  onUnitChange() {
    let unit = this.units.filter(u => u.id == this.newProduct.unitId)[0];
    this.newProduct.unitName = unit.name;
    this.newProduct.step = unit.step;
  }

  onSubmit() {
    if (this.newProduct.id) {
      this.productService.updateProducts(this.newProduct.id, this.newProduct)
        .subscribe(res => {
          console.log(JSON.stringify(res));
        })
    } else {
      this.productService.addProduct(this.newProduct)
        .subscribe(res => {
          console.log(JSON.stringify(res));
        });
    }
  }
  selectFileChanged() {
    let length = this.uploader.queue.length;
    if (length > 0) {
      this.uploader.queue[length - 1].onSuccess = (res, status, headers) => {
        if (status == 200) {
          let iii = length - 1;
          console.log('------------>iii:' + iii);
          console.log(res);
          let pic = JSON.parse(res);
          this.newProduct.pictures.push(pic);
          this.uploader.queue[iii].remove();
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
    this.productService.removePic(this.newProduct.id, pic.id)
      .subscribe(res => {
        if (res.state == 1) {
          this.newProduct.pictures.splice(this.newProduct.pictures.indexOf(pic), 1);
        }
      })
  }
}
