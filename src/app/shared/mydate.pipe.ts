import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: "mydate"
})
export class MyDatePipe implements PipeTransform {
    transform(now: any, pattern?: string): string {
        // let nowDate: Date = new Date(now);
        // if (nowDate) {
        //     let month = nowDate.getMonth() < 10 ? '0' + nowDate.getMonth() : nowDate.getMonth();
        //     let day = nowDate.getDate() < 10 ? '0' + nowDate.getDate() : nowDate.getDate();
        //     let hour = nowDate.getHours() < 10 ? '0' + nowDate.getHours() : nowDate.getHours();
        //     let minute = nowDate.getMinutes() < 10 ? '0' + nowDate.getMinutes() : nowDate.getMinutes();
        //     let seconds = nowDate.getSeconds() < 10 ? '0' + nowDate.getSeconds() : nowDate.getSeconds();
        //     return `${nowDate.getFullYear()}\-${month}\-${day} ${hour}:${minute}:${seconds}`;
        // } else {
        //     return '';
        // }
        return now.replace('T', ' ').substring(0, 19);
    }
}