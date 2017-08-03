import { Injectable } from '@angular/core';
import { baseUrl } from '../shared/settings';
import { HttpClient } from '../shared/httpclient';

import 'rxjs/add/operator/map';

@Injectable()
export class CouponService {

    constructor(private http: HttpClient) { }

    addCoupon(coupon) {
        return this.http.post(baseUrl + 'wechat/coupons/', coupon)
            .map(res => res.json());
    }

    getAllCoupons() {
        return this.http.get(baseUrl + 'wechat/coupons')
            .map(res => res.json());
    }

    updateCoupon(id, coupon) {
        return this.http.put(baseUrl + 'wechat/coupons/' + id, coupon)
            .map(res => res.json());
    }

    patchCoupon(id, patchDoc) {
        return this.http.patch(baseUrl + 'wechat/coupons/' + id, patchDoc)
            .map(res => res.json());
    }

    removePic(id, path) {
        return this.http.delete(baseUrl + 'wechat/coupons/' + id + '/pictures/' + encodeURIComponent(path))
            .map(res => res.json());
    }
}
