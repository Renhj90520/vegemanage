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
        this.currCategory.iconPath = JSON.parse(res).body.path;
        if (this.uploader.queue && this.uploader.queue.length > 0)
          this.uploader.queue[0].remove();
      } else {
      }
    };
  }

  onSubmit() {
    this.categoryService.addCategory(this.currCategory)
      .subscribe(res => {
        if (res.state == 1) {
          this.currCategory = new Category();
          this.categories.push(res.body);
        } else {
          alert(res.message);
        }
      }, err => {
        alert(err);
      })
  }
  onPicRemove() {
    this.categoryService.removePic(this.currCategory.id, this.currCategory.iconPath.substring(this.currCategory.iconPath.lastIndexOf('/') + 1))
      .subscribe(res => {
        if (res.state == 1) {
          this.currCategory.iconPath = null;
        } else {
          alert(res.message);
        }
      }, err => {
        alert(err);
      })
  }

  onEdit(category) {
    if (this.currCategory && this.currCategory.iconPath) {
      this.categoryService.removePic(0, this.currCategory.iconPath)
        .subscribe(res => {

        });
    }
    this.currCategory = category;
    if (this.uploader.queue.length > 0) {
      this.uploader.queue.forEach(item => {
        item.remove();
      });
    }
  }
  onRemove(category) {
    if (confirm('确定要删除该商品分类吗？')) {
      this.categoryService.deleteCategory(category.id)
        .subscribe(res => {
          if (res.state == 1) {
            this.categories.splice(this.categories.indexOf(category), 1);
          } else {
            alert(res.message);
          }
        }, err => alert(err));
    }
  }
  onUpdate() {
    this.categoryService.updateCate(this.currCategory)
      .subscribe(res => {
        if (res.state == 1) {
          this.currCategory=new Category();
          alert("修改成功");
        } else {
          alert(res.message);
        }
      }, err => alert(err));
  }
}
