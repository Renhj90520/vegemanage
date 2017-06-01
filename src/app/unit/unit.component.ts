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
  currUnit: Unit = new Unit();
  ngOnInit() {
    this.unitService.getAllUnits().subscribe(res => {
      this.units = res.body;
    },
      err => {
        alert(err);
      });
  }

  onAddUnit() {
    if (this.currUnit.id) {
      this.unitService.updateUnit(this.currUnit)
        .subscribe(res => {
          if (res.state == 1) {
            this.currUnit = new Unit();
          } else {
            alert(res.message);
          }
        }, err => {
          alert(err);
        })
    } else {
      this.unitService.addUnit(this.currUnit)
        .subscribe(res => {
          if (res.state == 1) {
            this.units.splice(0, 0, res.body);
            this.currUnit = new Unit();
          } else {
            alert('添加失败' + res.message);
          }
        }, err => {
          alert(err);
        });
    }
  }

  onEdit(index) {
    this.currUnit = this.units[index];
  }

  onRemove(index) {
    let id = this.units[index].id;
    this.unitService.removeUnit(id)
      .subscribe(res => {
        if (res.state == 1) {
          this.units.splice(index, 1);
        } else {
          alert(res.message);
        }
      },
      err => {
        alert(err);
      });
  }
}
