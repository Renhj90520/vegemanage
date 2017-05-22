import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: "orderstate"
})
export class OrderPipe implements PipeTransform {
    transform(value: any, pattern?: string): string {
        switch(value){
            case 0: return "未联系";
            case 1: return "派送中";
            case 2: return "交易取消";
            case 3: return "交易完成";
        }
    }
} 