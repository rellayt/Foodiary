import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import * as _ from 'lodash';
import { MatDialog } from '@angular/material/dialog';
import { CaloryHelpDialogComponent } from './calory-help-dialog/calory-help-dialog.component';
import { merge, Subscription } from 'rxjs';
import { FormBuilder } from '@angular/forms';
import { filter, first, map, mapTo, switchMap, tap } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { getCalory, getNutrientPercent } from 'src/app/utility/macro-calculations';
import { MacroService } from 'src/app/services/macro.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { calculateByCaloricBalanace, calculateByPercent, calculateByQuantity, updateCaloryValue } from 'src/app/utility/diary-calculator';
import { SnackBarService } from '../../../services/snack-bar.service';

export enum ControlState {
  CALORY,
  QUANTITY,
  PERCENT
}

@Component({
  selector: 'app-calory-form',
  templateUrl: './calory-form.component.html',
  styleUrls: ['./calory-form.component.scss']
})
export class CaloryFormComponent implements OnInit, OnDestroy {

  @ViewChild('caloriesInput') caloriesInput: ElementRef
  @ViewChild('dialogOpenButton', { static: true }) dialogOpenButton: any

  public ControlState: typeof ControlState = ControlState

  caloryForm

  state: ControlState
  subscriptions: Subscription[] = []

  percentageConflict = false
  nutrientConflict = true
  percentageSum = 0


  macro$ = this.route.data.pipe(
    map(data => data.macro),
    filter(macro => Object.values(macro).every(x => x !== 0)),
    first(),
    map(macro => this.mapMacroValues(macro))
  )

  constructor(private matDialogRef: MatDialog, private form: FormBuilder, private route: ActivatedRoute,
    private macroService: MacroService, private snackBar: SnackBarService) {
    this.caloryForm = this.form.group({
      calory: this.form.control(0),
      protein: this.createMacroGroup(),
      carb: this.createMacroGroup(),
      fat: this.createMacroGroup(),
    })
    this.macro$.subscribe(data => this.patchMacroValues(data))
  }

  createMacroGroup = () => this.form.group({ quantity: this.form.control(0), percent: this.form.control(0) })

  saveMacro() {
    const quantityValue = (name) => +this.caloryForm.get(name).controls['quantity'].value
    const macro = { protein: quantityValue('protein'), carb: quantityValue('carb'), fat: quantityValue('fat') }

    this.macroService.saveMacro(macro).subscribe(res => {
      this.macroService.clearCache()
      this.nutrientConflict = true
      this.snackBar.open("Pomyślnie zapisano")
    })
  }

  ngOnInit(): void {

    const calorySubscription = this.caloryForm.controls['calory']
      .valueChanges
      .pipe(filter(() => this.state === ControlState.CALORY))
      .subscribe(() => {
        this.nutrientConflict = this.checkNutrientConflict()
        calculateByCaloricBalanace(this.caloryForm)
      })

    const quantitySubscription = merge(
      this.caloryForm.get('protein').controls['quantity'].valueChanges,
      this.caloryForm.get('carb').controls['quantity'].valueChanges,
      this.caloryForm.get('fat').controls['quantity'].valueChanges)
      .pipe(filter(() => this.state === ControlState.QUANTITY))
      .subscribe(() => {
        calculateByQuantity(this.caloryForm)
        updateCaloryValue(this.caloryForm)
        this.percentageConflict = this.checkPercentageConflict()
        this.nutrientConflict = this.checkNutrientConflict()
      })

    const percentSubscription = merge(
      this.caloryForm.get('protein').controls['percent'].valueChanges.pipe(mapTo('protein')),
      this.caloryForm.get('carb').controls['percent'].valueChanges.pipe(mapTo('carb')),
      this.caloryForm.get('fat').controls['percent'].valueChanges.pipe(mapTo('fat')))
      .pipe(filter(() => this.state === ControlState.PERCENT))
      .subscribe(field => {
        calculateByPercent(String(field), this.caloryForm)
        this.percentageConflict = this.checkPercentageConflict()
        this.nutrientConflict = this.checkNutrientConflict()
      })

    this.subscriptions.push(calorySubscription, percentSubscription, quantitySubscription)
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe())
  }


  openDialog() {
    const dialog = this.matDialogRef.open(CaloryHelpDialogComponent, { disableClose: true });
    dialog.afterClosed()
      .pipe(
        first(),
        tap(() => this.dialogOpenButton._elementRef.nativeElement.blur()),
        filter(Boolean),
        map(macro => this.mapMacroValues(macro))
      )
      .subscribe(macro => {
        this.snackBar.open("Pomyślnie zapisano", 1700)
        this.patchMacroValues(macro)
      })
  }

  mapMacroValues(macro) {
    const { protein, carb, fat } = macro
    const calory = getCalory(macro)
    return {
      calory: calory,
      quantity: {
        protein: protein,
        carb: carb,
        fat: fat
      },
      percent: {
        protein: getNutrientPercent(protein * 4, calory),
        carb: getNutrientPercent(carb * 4, calory),
        fat: getNutrientPercent(fat * 9, calory)
      },
    }
  }

  patchMacroValues(data) {
    this.caloryForm.controls['calory'].setValue(data.calory)
    const nutrients = ['protein', 'carb', 'fat']
    nutrients.forEach(nutrient => {
      this.caloryForm.get(nutrient).controls['quantity'].setValue(data['quantity'][nutrient])
      this.caloryForm.get(nutrient).controls['percent'].setValue(data['percent'][nutrient])
    })
  }

  checkPercentageConflict() {
    const percentageValue = (name) => +this.caloryForm.get(name).controls['percent'].value
    const percentages = [percentageValue('protein'), percentageValue('carb'), percentageValue('fat')]
    this.percentageSum = +percentages.reduce((acc, val) => acc + val, 0).toFixed(1)

    return this.percentageSum !== 100 && this.percentageSum !== 0 ? true : false
  }

  checkNutrientConflict() {
    const quantityValue = (name) => +this.caloryForm.get(name).controls['quantity'].value
    const quantities = [quantityValue('protein'), quantityValue('carb'), quantityValue('fat')]

    return quantities.some(q => q === 0)
  }

}
