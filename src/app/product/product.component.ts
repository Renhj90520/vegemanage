import { Component, OnInit } from '@angular/core';
import { UnitService } from '../unit/unit.service';
import { ProductService } from './product.service';
import { CategoryService } from '../category/category.service';
import { Product } from '../models/product';

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
  constructor(private productService: ProductService,
    private unitService: UnitService,
    private categoryService: CategoryService) { }

  ngOnInit() {
    this.unitService.getAllUnits()
      .subscribe(res => {
        this.units = res.body;
      });
    this.categoryService.getAllCategories()
      .subscribe(res => {
        this.categories = res.body;
      });
    let unit = this.units.filter(u => u.id == this.newProduct.unitId)[0];
    this.newProduct.unitName = unit.name;
    this.newProduct.step = unit.step;
  }

  onUnitChange() {
    let unit = this.units.filter(u => u.id == this.newProduct.unitId)[0];
    this.newProduct.unitName = unit.name;
    this.newProduct.step = unit.step;
  }

}
