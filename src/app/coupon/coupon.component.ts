import { Component, OnInit } from '@angular/core';
import { CouponService } from './coupon.service';
import { FileUploader } from 'ng2-file-upload';
import { baseUrl } from '../shared/settings';
import { PatchDoc } from '../models/patchdoc';

@Component({
  selector: 'app-coupon',
  templateUrl: './coupon.component.html',
  styleUrls: ['./coupon.component.css'],
  providers: [CouponService]
})
export class CouponComponent implements OnInit {

  constructor(private couponService: CouponService) { }
  coupons = [];
  currCoupon: any = {};
  uploader: FileUploader;

  ngOnInit() {
    this.uploader = new FileUploader({
      url: baseUrl + 'upload',
      method: 'POST',
      itemAlias: 'upload',
    });
    this.uploader.authToken = 'Bearer ' + localStorage.getItem('token');

    this.couponService.getAllCoupons()
      .subscribe(res => {
        if (res.state === 1) {
          this.coupons = res.body || [];
        }
      }, err => {
        alert(err);
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
          this.currCoupon.QR_Path = JSON.parse(res).body.Path;
          if (this.uploader.queue && this.uploader.queue.length > 0) {
            this.uploader.queue[0].remove();
          }
        } else {
        }
      };
    }
  }
  onPicRemove() {
    this.couponService.removePic(this.currCoupon.Id,
      this.currCoupon.QR_Path.substring(this.currCoupon.QR_Path.lastIndexOf('/') + 1))
      .subscribe(res => {
        if (res.state === 1) {
          this.currCoupon.QR_Path = null;
        } else {
          alert(res.message);
        }
      }, err => {
        alert(err);
      });
  }

  onEdit(coupon) {
    if (this.currCoupon && this.currCoupon.QR_Path && !this.currCoupon.Id) {
      this.couponService.removePic(0, this.currCoupon.QR_Path)
        .subscribe(res => {

        });
    }
    this.currCoupon = coupon;
    this.currCoupon.Begin = this.currCoupon.Begin.substring(0, 10);
    this.currCoupon.End = this.currCoupon.End.substring(0, 10);
    if (this.uploader.queue.length > 0) {
      this.uploader.queue.forEach(item => {
        item.remove();
      });
    }
  }

  onUpdate() {
    this.couponService.updateCoupon(this.currCoupon.Id, this.currCoupon)
      .subscribe(res => {
        if (res.state === 1) {
          this.currCoupon = {};
          alert('修改成功');
        } else {
          alert(res.message);
        }
      }, err => alert(err));
  }
  onDisable(coupon) {
    const id = coupon.Id;
    const patchDocs = [];
    const stateDoc: PatchDoc = new PatchDoc();
    stateDoc.path = '/State';
    stateDoc.value = '0';
    patchDocs.push(stateDoc);
    this.couponService.patchCoupon(id, patchDocs)
      .subscribe(res => {
        if (res.state === 1) {
          coupon.State = '0';
        } else {
          alert(res.message);
        }
      }, err => {
        alert(err);
      });
  }
  onEnable(coupon) {
    const id = coupon.Id;
    const patchDocs = [];
    const stateDoc = new PatchDoc();
    stateDoc.path = '/State';
    stateDoc.value = '1';
    patchDocs.push(stateDoc);
    this.couponService.patchCoupon(id, patchDocs)
      .subscribe(res => {
        if (res.state === 1) {
          coupon.State = '1';
        } else {
          alert(res.message);
        }
      }, err => {
        alert(err);
      });
  }
  onSubmit() {
    this.currCoupon.State = '1';
    this.couponService.addCoupon(this.currCoupon)
      .subscribe(res => {
        if (res.state === 1) {
          this.currCoupon = {};
          this.coupons.push(res.body);
        } else {
          alert(res.message);
        }
      }, err => {
        alert(err);
      });
  }
}
