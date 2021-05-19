import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TooltipPosition } from '@angular/material/tooltip';
import { Macro } from '../../../../models/macro.model';
import { gsap } from 'gsap';
import { SnackBarService } from '../../../../services/snack-bar.service';
import { MacroService } from '../../../../services/macro.service';
import { physicalActivity } from 'src/app/helpers/userCalory';
import { calculateBasicMetabolism } from '../../../../helpers/userCalory';

@Component({
  selector: 'app-calory-help-dialog',
  templateUrl: './calory-help-dialog.component.html',
  styleUrls: ['./calory-help-dialog.component.scss']
})
export class CaloryHelpDialogComponent implements OnInit {
  @ViewChild('gender', { static: true }) gender: ElementRef
  @ViewChild('activity', { static: true }) activity: ElementRef
  @ViewChild('heightweight', { static: true }) heightweight: ElementRef
  @ViewChild('agesubmit', { static: true }) agesubmit: ElementRef

  @ViewChild('basicText1', { static: true }) basicText1: ElementRef
  @ViewChild('bMetabolism', { static: true }) bMetabolism: ElementRef
  @ViewChild('tabs', { static: true }) tabs: ElementRef
  @ViewChild('basicText2', { static: true }) basicText2: ElementRef
  @ViewChild('totalCalory', { static: true }) totalCalory: ElementRef
  @ViewChild('totalNutrients', { static: true }) totalNutrients: ElementRef
  @ViewChild('saveButton', { static: true }) saveButton: ElementRef

  caloryHelpForm: FormGroup

  physicalActivity = physicalActivity

  genders = [
    { value: 'male', viewValue: 'Mężczyzna' },
    { value: 'female', viewValue: 'Kobieta' }
  ]

  userTarget = 'stay';

  basicMetabolism = 0;
  totalMetabolism: number
  selectedGender: string;

  viewValues: Macro = { calory: 0, protein: 0, carb: 0, fat: 0 };
  viewText: string;
  result = false;

  constructor(private formBuilder: FormBuilder, private macroService: MacroService) {
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

  macroCalculation() {
    const { activity, weight, height, age } = this.caloryHelpForm.value
    this.basicMetabolism = calculateBasicMetabolism({ weight, height, age, gender: this.selectedGender })
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
        const calory = Math.round(this.totalMetabolism + item.value);

        this.viewValues.protein = Math.round((calory * 0.23) / 4)
        this.viewValues.carb = Math.round((calory * 0.54) / 4)
        this.viewValues.fat = Math.round((calory * 0.23) / 9)
        this.viewText = item.text

        this.viewValues.calory = calory;
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
