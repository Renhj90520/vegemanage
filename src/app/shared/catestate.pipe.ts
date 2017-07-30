import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'catestate'
})
export class CateStatePipe implements PipeTransform {
    transform(value: any, ...args: any[]) {
        switch (value) {
            case '0': return '停用';
            case '1': return '启用';
            default: return '';
        }
    }

}