import { Component, OnInit } from '@angular/core';
import { UnitService } from './unit.service';
import { Unit } from '../models/unit';

@Component({
  selector: 'app-unit',
  templateUrl: './unit.component.html',
  styleUrls: ['./unit.component.css'],
  providers: [UnitService]
})
export class UnitComponent implements OnInit {

  constructor(private unitService: UnitService) { }

  units: Unit[] = [];
  currUnit: Unit;// = new Unit("", 1);//TODO
  ngOnInit() {
    this.unitService.getAllUnits().subscribe(res => {
      console.log('---------------->' + JSON.stringify(res));
      this.units = res;
    },
      err => {
        console.log(err.stack);
      });

  }

  onAddUnit() {
    this.unitService.addUnit(this.currUnit)
      .subscribe(res => {
        if (res.state == 1) {
          this.units.push(this.currUnit);
          this.currUnit = new Unit();
        } else {
          alert('添加失败' + res.message);
        }
      });
  }
}
