import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'productstate'
})
export class ProductPipe implements PipeTransform {
    transform(value: any, pattern?: string): string {
        switch (value) {
            case 0: return '下架';
            case 1: return '销售';
        }
    }
}
