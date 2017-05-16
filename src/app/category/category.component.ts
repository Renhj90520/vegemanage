import { Component, OnInit } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { baseUrl } from '../shared/settings';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {
  uploader: FileUploader = new FileUploader({
    url: baseUrl + 'upload',
    method: 'POST',
    itemAlias: 'upload'
  });

  constructor() { }

  ngOnInit() {
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
