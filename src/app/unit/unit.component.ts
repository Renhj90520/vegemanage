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
  currUnit: Unit = new Unit();//TODO
  ngOnInit() {
    this.unitService.getAllUnits().subscribe(res => {
      this.units = res.body;
    },
      err => {
        if (err) {
          console.log(JSON.stringify(err));
        }
      });

  }

  onAddUnit() {
    this.unitService.addUnit(this.currUnit)
      .subscribe(res => {
        if (res.state == 1) {
          this.units.splice(0, 0, this.currUnit);
          this.currUnit = new Unit();
        } else {
          alert('添加失败' + res.message);
        }
      });
  }

  onEdit(index) {
    this.currUnit = this.units[index];
    console.log(JSON.stringify(this.currUnit));
  }

  onRemove(index) {
    let id = this.units[index].id;
    this.unitService.removeUnit(id)
      .subscribe(res => {
        if (res.state == 1) {
          this.units.splice(index, 1);
        }
      });
  }
}
