import { Component, Input, OnInit } from '@angular/core';
import { timer } from 'rxjs';
import { finalize, scan, startWith, takeWhile } from 'rxjs/operators';
import { Product } from 'src/app/models/products.model';
import { getMacroPercentages } from 'src/app/utility/macro-calculations';
import { deepCopy } from 'src/app/utility/utility';

@Component({
  selector: 'app-meal-template-summary',
  templateUrl: './meal-template-summary.component.html',
  styleUrls: ['./meal-template-summary.component.scss']
})
export class MealTemplateSummaryComponent {

  @Input() diaryMode = false

  templateSummary = {
    totalCalory: 0,
    quantity: {
      protein: 0,
      carb: 0,
      fat: 0
    },
    calory: {
      protein: 0,
      carb: 0,
      fat: 0
    },
    percentage: {
      protein: 0,
      carb: 0,
      fat: 0
    },
  }

  @Input() set abstractProducts(abstractProducts: Product[]) {
    const nutriments = ['protein', 'carb', 'fat']

    const cached_templateSummary = deepCopy(this.templateSummary)

    this.templateSummary.totalCalory = 0
    nutriments.forEach((name, i) => {
      this.templateSummary.quantity[name] = +abstractProducts
        .map(product => product[name])
        .reduce((acc, val) => acc + val, 0)

      this.templateSummary.calory[name] = this.templateSummary.quantity[name] * (i !== 2 ? 4 : 9)

      this.templateSummary.totalCalory += this.templateSummary.calory[name]
    })
    const { quantity: { protein: protein }, quantity: { carb: carb }, quantity: { fat: fat } } = this.templateSummary
    const nutrimentsPercentage = getMacroPercentages({ protein: protein, carb: carb, fat: fat })

    nutriments.forEach((name, i) => this.templateSummary.percentage[name] = nutrimentsPercentage[i])

    this.summaryCountAnimation(cached_templateSummary)
  }

  summaryCountAnimation(cached_templateSummary) {
    const { totalCalory, quantity, calory, percentage } = deepCopy(this.templateSummary)
    const nutriments = ['protein', 'carb', 'fat'], properties = Object.keys(this.templateSummary)
    const propertyTargetValue = [quantity, calory, percentage]
    properties.shift()

    this.counterAnimation(cached_templateSummary.totalCalory, this.templateSummary.totalCalory)
      .pipe(finalize(() => this.templateSummary.totalCalory = totalCalory))
      .subscribe(value => this.templateSummary.totalCalory = value)

    nutriments.forEach(name =>
      properties.forEach((property, i) => {
        this.counterAnimation(cached_templateSummary[property][name], this.templateSummary[property][name])
          .pipe(finalize(() => this.templateSummary[property][name] = propertyTargetValue[i][name] || 0))
          .subscribe(value => this.templateSummary[property][name] = +value.toFixed(1))
      }))
  }

  counterAnimation(from: number, to: number) {
    const absolute = Math.abs(from - to)
    const value = Math.round(((absolute / 10) * 5) / 7) || 0.3

    return timer(100, 35).pipe(
      startWith(from),
      scan(acc => from < to ? acc + value : acc - value),
      takeWhile(x => (from < to) ? (x <= to) : (x >= to)),
    )
  }
  constructor() { }
}
