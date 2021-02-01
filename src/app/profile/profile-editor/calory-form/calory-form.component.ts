import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Nutrients } from '../../../models/nutrients.model';
import * as _ from 'lodash';
import { HostListener } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CaloryHelpDialogComponent } from './calory-help-dialog/calory-help-dialog.component';

@Component({
  selector: 'app-calory-form',
  templateUrl: './calory-form.component.html',
  styleUrls: ['./calory-form.component.scss']
})
export class CaloryFormComponent implements OnInit {

  @ViewChild('caloriesInput') caloriesInput: ElementRef;

  title = 'test-lodash';
  constructor(private dialog: MatDialog) { }

  nutrients: Nutrients = { calory: 0, protein: 0, carbs: 0, fat: 0 };
  percentages = { proteinPercent: 0, carbsPercent: 0, fatPercent: 0 };
  percentageConflict = false;
  checked = false;
  percentageSum = 0;
  caloriesTemp = 0;
  actualInput: any;

  ngOnInit(): void {
  }

  openDialog() {
    this.dialog.open(CaloryHelpDialogComponent, {
      disableClose: true
    });
  }

  @HostListener('input') valueChanges() {
    const nutrientNames = ['nutrients.calory', 'nutrients.protein', 'nutrients.carbs', 'nutrients.fat'];
    const percentageNames = ['percentages.proteinPercent', 'percentages.carbsPercent', 'percentages.fatPercent'];
    const { proteinPercent, carbsPercent, fatPercent } = this.percentages;
    const { value } = this.actualInput;
    let { name } = this.actualInput;

    //Jeżeli będzie input kalorii i procenty są na 0
    if (name === 'nutrients.calory' && Object.values(this.percentages).every(item => item === 0)) {
      this.percentageConflict = true;
      // this.nutrients.calory = this.calcCalory();
    }

    //Jeżeli będzie input kalorii i procenty są większe niż 0
    if (name === 'nutrients.calory' && Object.values(this.percentages).some(item => item > 0)) {
      this.calcFromCalories(value);
    }

    //Finds nutrients input
    if (nutrientNames.splice(1).some(item => item === name)) {
      this.nutrients.calory = this.calcCalory();
      this.calcFromNutrient();
    }
    //Finds percentage input
    if (percentageNames.some(item => item === name)) {
      this.calcFromPercent(name);
    }
    this.caloriesTemp = this.nutrients.calory;
    this.percentageSum = Math.round(+this.percentages.proteinPercent + +this.percentages.carbsPercent + +this.percentages.fatPercent);

    if (this.percentageSum != 100) {
      this.percentageConflict = true;
    } else {
      this.percentageConflict = false;
    }
  }


  calcFromPercent = (field) => {
    if (field == "percentages.proteinPercent") {
      this.nutrients.protein = Math.round(((this.percentages.proteinPercent / 100) * this.nutrients.calory) / 4);
    }
    if (field == "percentages.carbsPercent") {
      this.nutrients.carbs = Math.round(((this.percentages.carbsPercent / 100) * this.nutrients.calory) / 4);
    }
    if (field == "percentages.fatPercent") {
      this.nutrients.fat = Math.round(((this.percentages.fatPercent / 100) * this.nutrients.calory) / 9);
    }
  };

  calcFromNutrient = () => {
    const { protein, carbs, fat } = this.nutrients;
    const proteinCalories = protein * 4;
    const carbsCalories = carbs * 4;
    const fatCalories = fat * 9;
    const totalCalories = proteinCalories + carbsCalories + fatCalories;
    this.percentages.proteinPercent = Number((100 * proteinCalories / totalCalories).toFixed(1));
    this.percentages.carbsPercent = Number((100 * carbsCalories / totalCalories).toFixed(1));
    this.percentages.fatPercent = Number((100 * fatCalories / totalCalories).toFixed(1));
  };

  calcCalory = (): number => this.nutrients.protein * 4 + this.nutrients.carbs * 4 + this.nutrients.fat * 9;

  calcFromCalories = (value: number) => {
    const { proteinPercent, carbsPercent, fatPercent } = this.percentages;

    const calorieDifference = value > this.caloriesTemp ? value - this.caloriesTemp : this.caloriesTemp - value;

    const proteinDifference = calorieDifference * proteinPercent / 100;
    const carbsDifference = calorieDifference * carbsPercent / 100;
    const fatDifference = calorieDifference * fatPercent / 100;

    if (value > this.caloriesTemp) {
      this.nutrients.protein += Math.round(proteinDifference / 4);
      this.nutrients.carbs += Math.round(carbsDifference / 4);
      this.nutrients.fat += Math.round(fatDifference / 9);
      this.caloriesTemp = value;
    } else {
      this.nutrients.protein -= Math.round(proteinDifference / 4);
      this.nutrients.carbs -= Math.round(carbsDifference / 4);
      this.nutrients.fat -= Math.round(fatDifference / 9);
      this.caloriesTemp = value;
    }
    if (Object.values(this.nutrients).some(item => item < 0) || this.nutrients.calory == 0) {
      this.nutrients = { calory: 0, protein: 0, carbs: 0, fat: 0 };
    }
    this.caloriesTemp = this.nutrients.calory;
    this.checked = true;
  };

  update(input: any) {
    this.actualInput = input;
    input.value = input.value === 0 ? '' : +input.value;
  }
}
