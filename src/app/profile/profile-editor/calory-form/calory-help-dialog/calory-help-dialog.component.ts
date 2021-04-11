import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TooltipPosition } from '@angular/material/tooltip';
import { Macro } from '../../../../models/macro.model';
import { gsap } from 'gsap';
import { SnackBarService } from '../../../../services/snack-bar.service';
import { MacroService } from '../../../../services/macro.service';

@Component({
  selector: 'app-calory-help-dialog',
  templateUrl: './calory-help-dialog.component.html',
  styleUrls: ['./calory-help-dialog.component.scss']
})
export class CaloryHelpDialogComponent implements OnInit {

  @ViewChild('gender', { static: true }) gender: ElementRef<HTMLDivElement>;
  @ViewChild('activity', { static: true }) activity: ElementRef<HTMLDivElement>;
  @ViewChild('heightweight', { static: true }) heightweight: ElementRef<HTMLDivElement>;
  @ViewChild('agesubmit', { static: true }) agesubmit: ElementRef<HTMLDivElement>;

  @ViewChild('basicText1', { static: true }) basicText1: ElementRef<HTMLDivElement>;
  @ViewChild('bMetabolism', { static: true }) bMetabolism: ElementRef<HTMLDivElement>;
  @ViewChild('tabs', { static: true }) tabs: ElementRef<HTMLDivElement>;
  @ViewChild('basicText2', { static: true }) basicText2: ElementRef<HTMLDivElement>;
  @ViewChild('totalCalory', { static: true }) totalCalory: ElementRef<HTMLDivElement>;
  @ViewChild('totalNutrients', { static: true }) totalNutrients: ElementRef<HTMLDivElement>;
  @ViewChild('saveButton', { static: true }) saveButton: ElementRef<HTMLDivElement>;


  caloryHelpForm: FormGroup

  tooltipPosition: TooltipPosition = 'above';

  physicalActivity = [
    { value: 1.112, viewValue: 'Prawie brak' },
    { value: 1.272, viewValue: 'Lekka aktywność' },
    { value: 1.425, viewValue: 'Umiarkowana aktywność' },
    { value: 1.60, viewValue: 'Duża aktywność' },
    { value: 1.785, viewValue: 'Bardzo duża aktywność' },
  ];

  genders = [
    { value: 'male', viewValue: 'Mężczyzna' },
    { value: 'female', viewValue: 'Kobieta' }
  ];

  userTarget = 'stay';

  basicMetabolism = 0;
  totalMetabolism: number
  selectedGender: string;

  viewValues: Macro = { calory: 0, protein: 0, carb: 0, fat: 0 };
  viewText: string;
  result = false;

  constructor(private formBuilder: FormBuilder, private snackBar: SnackBarService, private macroService: MacroService) {
    this.caloryHelpForm = this.formBuilder.group({
      activity: ['', [Validators.required]],
      weight: ['', [Validators.required, Validators.min(35), Validators.max(180)]],
      height: ['', [Validators.required, Validators.min(100), Validators.max(230)]],
      age: ['', [Validators.required, Validators.min(12), Validators.max(120)]],
    });
  }

  ngOnInit(): void {
    const items = [{ ref: this.gender, x: -15, y: 0 },
    { ref: this.activity, x: 15, y: 0 },
    { ref: this.heightweight, x: -15, y: 0 },
    { ref: this.agesubmit, x: 15, y: 0 },
    ];
    items.forEach(item => this.initItemAnimation(item.ref, item.x, item.y))
  }
  initItemAnimation = (item: ElementRef<HTMLDivElement>, x: number, y: number) => {
    gsap.from(item.nativeElement, {
      duration: 0.7,
      opacity: 0,
      y: y,
      x: x,
      stagger: 25,
      delay: 0.2,
    });
  }
  getErrorMessage(name: any) {
    if (this.caloryHelpForm.get(name).hasError('required')) return 'Wprowadź wartość'

    return 'Nieprawidłowa wartość'
  }

  calculate() {
    const value = (name: string) => this.caloryHelpForm.get(name).value;
    const [activity, weight, height, age] = [value('activity'), value('weight'), value('height'), value('age')];
    if (this.selectedGender === 'male') {
      this.basicMetabolism = Math.round(66.5 + (13.75 * weight) + (5.003 * height) - (6.775 * age));
    } else {
      this.basicMetabolism = Math.round(665.1 + (9.563 * weight) + (1.85 * height) - (4.676 * age));
    }
    const SDDP = this.basicMetabolism / 10;

    this.totalMetabolism = Math.round(this.basicMetabolism * activity + SDDP)

    this.viewValues.calory = this.totalMetabolism;
    this.changeTarget('stay')
    this.result = true;

    const items = [{ ref: this.basicText1, x: 10, y: 0 },
    { ref: this.basicText2, x: 0, y: 0 },
    { ref: this.bMetabolism, x: -10, y: 0 },
    { ref: this.tabs, x: 0, y: 0 },
    { ref: this.totalCalory, x: -5, y: 0 },
    { ref: this.totalNutrients, x: 5, y: 0 },
    { ref: this.saveButton, x: 0, y: 0 },
    ];
    items.forEach(item => this.initItemAnimation(item.ref, item.x, item.y))
  }

  changeTarget(name: string) {
    this.userTarget = name;
    const values = [
      { name: 'loss', value: -this.totalMetabolism * 0.12, text: 'schudnąć' },
      { name: 'stay', value: 0, text: 'zachować wagę' },
      { name: 'mass', value: this.totalMetabolism * 0.12, text: 'przytyć' }
    ];
    values.forEach(item => {
      if (item.name === name) {
        const tempCalory = this.totalMetabolism + item.value;
        this.viewValues.protein = Math.round((tempCalory * 0.23) / 4)
        this.viewValues.carb = Math.round((tempCalory * 0.54) / 4)
        this.viewValues.fat = Math.round((tempCalory * 0.23) / 9)
        this.viewText = item.text
        this.viewValues.calory = this.viewValues.protein * 4 + this.viewValues.carb * 4 + this.viewValues.fat * 9;
      }
    }
    );
  }
  save() {
    const data = { protein: this.viewValues.protein, carb: this.viewValues.carb, fat: this.viewValues.fat }
    this.macroService.saveMacro(data)
      .subscribe(res => {
        this.macroService.clearCache()
      })
  }
}
