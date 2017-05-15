import { Http } from '@angular/http';
import { baseUrl } from '../shared/settings';
import { Injectable } from '@angular/core';
import { Unit } from '../models/unit';
import 'rxjs/add/operator/map';

@Injectable()
export class UnitService {
    constructor(private http: Http) { }

    getAllUnits() {
        return this.http.get(baseUrl + 'units')
            .map(res => res.json());
    }

    addUnit(unit: Unit) {
        return this.http.post(baseUrl + 'units', unit)
            .map(res => res.json());
    }
}
