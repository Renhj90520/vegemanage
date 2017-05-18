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
        console.log('-------------upload--------------');
        console.log(JSON.stringify(res));
      } else {
      }
    };
  }

}
