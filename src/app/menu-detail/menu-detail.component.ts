import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { FileUploader } from 'ng2-file-upload';
import { baseUrl } from '../shared/settings';
import { CategoryService } from '../category/category.service';
import { ProductService } from '../product/product.service';
import { MenuService } from '../menu-list/menu.service';

@Component({
  selector: 'app-menu-detail',
  templateUrl: './menu-detail.component.html',
  styleUrls: ['./menu-detail.component.css'],
  providers: [CategoryService, ProductService, MenuService]
})
export class MenuDetailComponent implements OnInit {
  menuForm: FormGroup;
  menu: any;
  uploader: FileUploader;
  categories = [];
  products = [];
  productsWithIndex = [];
  get recipes(): FormArray {
    return <FormArray>this.menuForm.get('recipes');
  }

  get steps(): FormArray {
    return <FormArray>this.menuForm.get('steps');
  }

  constructor(private fb: FormBuilder,
    private categoryService: CategoryService,
    private productService: ProductService,
    private menuService: MenuService) { }

  ngOnInit() {
    this.initForm();
    this.uploader = new FileUploader({
      url: baseUrl + 'upload',
      method: 'POST',
      itemAlias: 'upload',
    });
    this.uploader.authToken = 'Bearer ' + localStorage.getItem('token');
    this.uploader.onAfterAddingFile = (file) => {
      file.withCredentials = false;
    };
    this.menu = {};
    this.categoryService.getAllCategories()
      .subscribe(res => {
        if (res.state === 1) {
          this.categories = res.body;
          if (this.categories && this.categories.length > 0) {
            const firstCate = this.categories[0];
            this.productService.getProducts(null, null, null, { category: firstCate.Id }, null)
              .subscribe(resProd => {
                if (resProd.state === 1) {
                  const cateProd: any = {};
                  cateProd.Category = firstCate.Id;
                  cateProd.Products = resProd.body.items;
                  this.products.push(cateProd);
                  this.productsWithIndex[0] = cateProd.Products;
                }
              });
          }
        }
      });
  }

  buildRecipes(): FormGroup {
    return this.fb.group({
      productId: '',
      cateId: ''
    });
  }

  buildSteps(): FormGroup {
    return this.fb.group({
      description: ''
    });
  }

  addRecipes(event) {
    event.preventDefault();
    this.productsWithIndex.push(this.products[0].Products);
    this.recipes.push(this.buildRecipes());
  }

  addStep(event) {
    event.preventDefault();
    this.steps.push(this.buildSteps());
  }

  selectFileChanged() {
    const length = this.uploader.queue.length;
    if (length > 0) {
      const pic = this.uploader.queue[length - 1];
      pic.onSuccess = (res, status, headers) => {
        if (status === 200) {
          const ppp = pic;
          const result = JSON.parse(res);
          this.menu.Picture = result.body.Path;
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
  catechange(event, index) {
    const categoryId = event.currentTarget.value;
    const cateProds = this.products.find(p => p.Category == categoryId);
    if (cateProds) {
      this.productsWithIndex[index] = cateProds.Products;
    } else {
      const condition: any = {};
      condition.category = categoryId;
      this.productService.getProducts(null, null, null, condition, null)
        .subscribe(res => {
          const cateProd: any = {};
          cateProd.Category = categoryId;
          cateProd.Products = res.body.items;
          this.products.push(cateProd);
          this.productsWithIndex[index] = cateProd.Products;
        });
    }
  }

  removeRecipe(index) {
    this.recipes.removeAt(index);
    this.productsWithIndex.splice(index, 1);
  }

  removeStep(index) {
    this.steps.removeAt(index);
  }

  submit(event) {
    event.preventDefault();
    const recs = this.menuForm.value.recipes;
    this.menu.Name = this.menuForm.value.name;
    const recipes = [];
    recs.forEach(rec => {
      const productId = rec.productId;
      const product: any = this.products.filter(c => c.Category == rec.cateId)[0].Products.filter(p => p.Id == productId);
      recipes.push({ ProductId: productId, ProductName: product[0].Name });
    });
    this.menu.Recipes = recipes;
    const steps = this.menuForm.value.steps;
    console.log(steps);
    const sts = [];
    steps.forEach(step => {
      sts.push({ Description: step.description });
    });
    console.log(this.menuForm.value);
    this.menu.Steps = sts;

    this.menu.State = '1';
    this.menuService.addMenu(this.menu)
      .subscribe(res => {
        if (res.state === 1) {
          alert('提交成功');
          this.initForm();
          this.productsWithIndex = [];
          this.menu.Picture = null;
        }
      }, err => {
        alert(err);
      });
  }

  private initForm() {
    this.menuForm = this.fb.group({
      name: [''],
      recipes: this.fb.array([this.buildRecipes()]),
      steps: this.fb.array([this.buildSteps()])
    });
  }
}
