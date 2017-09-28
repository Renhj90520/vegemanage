import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'menustate'
})
export class MenuState implements PipeTransform {
    transform(state: any, pattern?: string): string {
        return state === '1' ? '有效' : '无效';
    }
}
