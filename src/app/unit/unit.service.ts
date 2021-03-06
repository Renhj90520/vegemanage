import { HttpClient } from '../shared/httpclient';
import { baseUrl } from '../shared/settings';
import { Injectable } from '@angular/core';
import { Unit } from '../models/unit';
import 'rxjs/add/operator/map';

@Injectable()
export class UnitService {
    constructor(private http: HttpClient) { }

    getAllUnits() {
        return this.http.get(baseUrl + 'units')
            .map(res => res.json());
    }

    addUnit(unit: Unit) {
        return this.http.post(baseUrl + 'units', unit)
            .map(res => res.json());
    }

    removeUnit(id: number) {
        return this.http.delete(baseUrl + 'units/' + id)
            .map(res => res.json());
    }

    updateUnit(unit: Unit) {
        return this.http.put(baseUrl + 'units', unit)
            .map(res => res.json());
    }
}
