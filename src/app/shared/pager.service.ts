import * as _ from 'underscore';
import { Injectable } from '@angular/core';

@Injectable()
export class PagerService {
    getPager(total: number, currPage: number = 1, pageSize: number = 20) {
        let totalPages = Math.ceil(total / pageSize);
        let startPage: number, endPage: number;
        if (totalPages < 10) {
            startPage = 1;
            endPage = totalPages;
        } else {
            if (currPage < 6) {
                startPage = 1;
                endPage = 10;
            } else if (currPage + 4 >= totalPages) {
                startPage = totalPages - 9;
                endPage = totalPages;
            } else {
                startPage = currPage - 5;
                endPage = currPage + 4;
            }
        }

        let startIndex = (currPage - 1) * pageSize;
        let endIndex = Math.min(startIndex + pageSize - 1, total - 1);

        let pages = _.range(startPage, endPage + 1);
        return {
            total: total,
            currPage: currPage,
            pageSize: pageSize,
            totalPages: totalPages,
            startPage: startPage,
            endPage: endPage,
            startIndex: startIndex,
            endIndex: endIndex,
            pages: pages
        }
    }
}