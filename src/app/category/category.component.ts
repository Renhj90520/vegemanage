import { Component, OnInit } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { baseUrl } from '../shared/settings';
import { CategoryService } from './category.service';
import { Category } from '../models/category';
import { PatchDoc } from '../models/patchdoc';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css'],
  providers: [CategoryService]
})
export class CategoryComponent implements OnInit {

  uploader: FileUploader;
  categories: Category[];
  currCategory: Category = new Category();
  constructor(private categoryService: CategoryService) { }

  ngOnInit() {
    this.uploader = new FileUploader({
      url: baseUrl + 'upload',
      method: 'POST',
      itemAlias: 'upload',
    });
    this.uploader.authToken = 'Bearer ' + localStorage.getItem('token');

    this.categoryService.getAllCategories()
      .subscribe(res => {
        this.categories = res.body;
      });
    this.uploader.onAfterAddingFile = (file) => {
      file.withCredentials = false;
    };
  }

  selectFileOnChanged() {
    const length = this.uploader.queue.length;
    if (length > 0) {
      this.uploader.queue[0].onSuccess = (res, status, headers) => {
        if (status === 200) {
          this.currCategory.IconPath = JSON.parse(res).body.Path;
          if (this.uploader.queue && this.uploader.queue.length > 0) {
            this.uploader.queue[0].remove();
          }
        } else {
        }
      };
    }
  }

  onSubmit() {
    this.currCategory.State = '1';
    this.categoryService.addCategory(this.currCategory)
      .subscribe(res => {
        if (res.state === 1) {
          this.currCategory = new Category();
          this.categories.push(res.body);
        } else {
          alert(res.message);
        }
      }, err => {
        alert(err);
      });
  }
  onPicRemove() {
    this.categoryService.removePic(this.currCategory.Id,
      this.currCategory.IconPath.substring(this.currCategory.IconPath.lastIndexOf('/') + 1))
      .subscribe(res => {
        if (res.state === 1) {
          this.currCategory.IconPath = null;
        } else {
          alert(res.message);
        }
      }, err => {
        alert(err);
      });
  }

  onEdit(category: Category) {
    if (this.currCategory && this.currCategory.IconPath && !this.currCategory.Id) {
      this.categoryService.removePic(0, this.currCategory.IconPath)
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
  onRemove(category: Category) {
    if (confirm('确定要删除该商品分类吗？')) {
      this.categoryService.deleteCategory(category.Id)
        .subscribe(res => {
          if (res.state === 1) {
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
        if (res.state === 1) {
          this.currCategory = new Category();
          alert('修改成功');
        } else {
          alert(res.message);
        }
      }, err => alert(err));
  }

  onDisable(category: Category) {
    const id = category.Id;
    const patchDocs = [];
    const stateDoc: PatchDoc = new PatchDoc();
    stateDoc.path = '/State';
    stateDoc.value = '0';
    patchDocs.push(stateDoc);
    this.categoryService.patchCate(id, patchDocs)
      .subscribe(res => {
        if (res.state === 1) {
          category.State = '0';
        } else {
          alert(res.message);
        }
      }, err => {
        alert(err);
      });
  }
  onEnable(category: Category) {
    const id = category.Id;
    const patchDocs = [];
    const stateDoc = new PatchDoc();
    stateDoc.path = '/State';
    stateDoc.value = '1';
    patchDocs.push(stateDoc);
    this.categoryService.patchCate(id, patchDocs)
      .subscribe(res => {
        if (res.state === 1) {
          category.State = '1';
        } else {
          alert(res.message);
        }
      }, err => {
        alert(err);
      });
  }
}
