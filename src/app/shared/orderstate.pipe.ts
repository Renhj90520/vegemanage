import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'orderstate'
})
export class OrderPipe implements PipeTransform {
    transform(value: any, pattern?: string): string {
        switch (value) {
            case 0: return '未支付';
            case 1: return '已支付';
            case 2: return '已联系';
            case 3: return '派送中';
            case 4: return '已取消';
            case 5: return '交易完成';
            case 6: return '已退款';
            case 7: return '已删除';
        }
    }
}
