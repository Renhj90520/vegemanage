import { Component, OnInit } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { baseUrl } from '../shared/settings';
import { CategoryService } from './category.service';
import { Category } from '../models/category';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css'],
  providers: [CategoryService]
})
export class CategoryComponent implements OnInit {
  uploader: FileUploader = new FileUploader({
    url: baseUrl + 'upload',
    method: 'POST',
    itemAlias: 'upload'
  });

  categories: Category[];
  currCategory: Category = new Category();
  constructor(private categoryService: CategoryService) { }

  ngOnInit() {
    this.categoryService.getAllCategories()
      .subscribe(res => {
        this.categories = res.body;
      });
    this.uploader.onAfterAddingFile = (file) => {
      file.withCredentials = false;
    }

  }

  selectFileOnChanged() {
    this.uploader.queue[0].onSuccess = (res, status, headers) => {
      if (status == 200) {
        this.currCategory.iconpath = JSON.parse(res).path;
      } else {
      }
    };
  }

  onSubmit() {
    this.categoryService.addCategory(this.currCategory)
      .subscribe(res => {
        if(res.state==1){
          this.currCategory=new Category();
          this.categories.push(res.body);
        }
      })
  }

}
