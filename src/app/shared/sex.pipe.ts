import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'sex'
})
export class SexPipe implements PipeTransform {
    transform(value: any, ...args: any[]) {
        switch (value) {
            case 1: return '男';
            case 2: return '女';
            default: return '';
        }
    }
}