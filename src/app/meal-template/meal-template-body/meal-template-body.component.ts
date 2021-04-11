import { Component, ElementRef, OnInit, ViewChild, Output, Input } from '@angular/core';
import { filter, mergeMap, tap, } from 'rxjs/operators';
import { MealTemplate } from '../../models/mealTemplate.model';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Product } from '../../models/products.model';
import { getCalory, getMacroPercentages } from 'src/app/utility/macro-calculations';
import { MatTooltipDefaultOptions, MAT_TOOLTIP_DEFAULT_OPTIONS } from '@angular/material/tooltip';
import { ProductAdditionDialogComponent } from './quick-add-product/product-addition-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { SnackBarService } from '../../services/snack-bar.service';
import { MealTemplateSearchComponent } from './meal-template-search/meal-template-search.component';
import { EventEmitter } from '@angular/core';
import { MealTemplateService } from '../../services/mealTemplate.service';
import { __importDefault } from 'tslib';
import { HttpErrorResponse } from '@angular/common/http';
import { iif, timer } from 'rxjs';
import { MealTemplateSummaryComponent } from './meal-template-summary/meal-template-summary.component';
import { clearProduct } from 'src/app/helpers/meal-template';

export const tooltipSettings: MatTooltipDefaultOptions = {
  showDelay: 0,
  hideDelay: 0,
  touchendHideDelay: 0,
};

@Component({
  selector: 'app-meal-template-body',
  templateUrl: './meal-template-body.component.html',
  styleUrls: ['./meal-template-body.component.scss'],
  providers: [
    { provide: MAT_TOOLTIP_DEFAULT_OPTIONS, useValue: tooltipSettings },
  ],
})
export class MealTemplateBodyComponent implements OnInit {
  @ViewChild('macro', { static: true }) macro: ElementRef
  @ViewChild('productSearch') productSearch: MealTemplateSearchComponent
  @ViewChild('mealTemplateSummary') mealTemplateSummary: MealTemplateSummaryComponent

  @Input() mealTemplate: MealTemplate = { name: '', time: '00:00', products: [] }
  @Input() type = 'create'
  @Input() diaryMode = false

  @Output() goBack: EventEmitter<Boolean> = new EventEmitter()
  @Output() scrollDown: EventEmitter<Boolean> = new EventEmitter()
  @Output() summaryUpdate: EventEmitter<Boolean> = new EventEmitter()
  @Output() templateName: EventEmitter<Boolean> = new EventEmitter()

  abstractProducts: Product[]

  ngOnInit(): void {
    if (this.mealTemplate.products.length > 0) {
      this.mealTemplate.products = this.mealTemplate.products.map(product =>
        ({ ...product, percentages: getMacroPercentages(product) }))
    }
    this.abstractProducts = [...this.mealTemplate.products]
  }

  addOwnProduct(elementRef: any) {
    const dialogRef = this.dialog.open(ProductAdditionDialogComponent, {
      autoFocus: false,
      disableClose: true,
      width: '800px',
    })
    dialogRef.afterClosed().pipe(
      tap(() => elementRef._elementRef.nativeElement.blur()),
      filter(Boolean),
    ).subscribe((product: Product) => {
      this.mealTemplate.products.push({ quantity: 100, calory: getCalory(product), ...product })

      this.abstractProducts = [...this.mealTemplate.products]
      this.scrollDown.emit(null)
    })
  }

  createAbstractSummary = (product: Product) => {
    const abstractProducts = [...this.mealTemplate.products]

    if (product) abstractProducts.push(product)
    this.abstractProducts = [...abstractProducts]
  }

  removeProduct(product: Product): void {
    const index = this.mealTemplate.products.indexOf(product)

    if (index >= 0) {
      this.mealTemplate.products.splice(index, 1)
      this.abstractProducts = [...this.mealTemplate.products]
    }
  }

  resetMealTemplate = () => {
    this.mealTemplate = { name: '', time: '00:00', products: [] }
    this.productSearch.productSearchForm.controls['query'].setValue('')

    this.productSearch.selectedProduct ? this.productSearch.resetSelectedProduct() : this.abstractProducts = []
  }

  drop = (event: CdkDragDrop<Product[]>) =>
    moveItemInArray(this.mealTemplate.products, event.previousIndex, event.currentIndex)

  calculateByQuantity = (value: number, index: number) => {
    try {
      value = value === 0 || value === null ? 1 : value > 1000 ? value / 10 : value > 10000 ? value / 100 : value
      const product = this.mealTemplate.products[index], { quantity } = product

      if ((value <= 1 && quantity <= 1) || this.mealTemplate.products[index].quantity === value) return
      const nutriments = ['protein', 'carb', 'fat']

      nutriments.forEach(name => this.mealTemplate.products[index][name] = (product[name] / quantity) * value)

      this.mealTemplate.products[index].quantity = value

      const calory = +getCalory(this.mealTemplate.products[index])

      if (calory > 999) {
        this.snackBar.open('Wyliczona wartość jest zbyt duża, dodaj produkt ponownie', 2800, true)
        this.mealTemplate.products.splice(index, 1)
      } else {
        this.mealTemplate.products[index].calory = calory

        this.abstractProducts = [...this.mealTemplate.products]
      }
    } catch (err) {
      console.error(err);
    }
  }

  calculateByCalory = (value: number, index: number) => {
    try {
      value = value === 0 || value === null ? 1 : value > 1000 ? value / 10 : value > 10000 ? value / 100 : value
      const product = this.mealTemplate.products[index], { calory } = product
      if ((value <= 1 && calory <= 1) || this.mealTemplate.products[index].quantity === value) return
      const nutriments = ['protein', 'carb', 'fat'], { quantity, percentages } = product

      nutriments.forEach((name, i) => this.mealTemplate.products[index][name] = ((value * percentages[i]) / 100) / (i !== 2 ? 4 : 9))

      const result = (value * quantity) / calory

      if (result > 999) {
        this.snackBar.open('Wyliczona wartość jest zbyt duża, dodaj produkt ponownie', 2800, true)
        this.mealTemplate.products.splice(index, 1)
      } else {
        this.mealTemplate.products[index].quantity = result
        this.mealTemplate.products[index].calory = Math.round(value)
      }

      this.abstractProducts = [...this.mealTemplate.products]
    } catch (err) {
      console.error(err);
    }
  }

  addProduct(product: Product) {
    this.mealTemplate.products.push(product)
    this.scrollDown.emit(null)
  }

  save() {
    const products = this.mealTemplate.products.map((product: any) => clearProduct(product))

    const { time, name, id } = this.mealTemplate
    const mealTemplate = { time: time, name: name, products: products }

    timer(50).pipe(
      mergeMap(() => iif(() => this.type === 'create',
        this.mealTemplateService.save(mealTemplate),
        this.mealTemplateService.update(mealTemplate, id)))
    ).subscribe(res => {
      this.snackBar.open(this.type === 'create' ? 'Szablon pomyślnie zapisany' : 'Szablon pomyślnie zaktualizowany')
      this.type === 'update' ? this.goBack.emit(true) : this.resetMealTemplate()
    }, (error: HttpErrorResponse) => {
      let message = error.status === 409 ? 'Nazwa już istnieje' : 'Błąd serwera'
      if (error.status === 409) this.mealTemplate.name = ''
      this.snackBar.open(message, 1400, true)
    })
  }
  constructor(private dialog: MatDialog, private snackBar: SnackBarService, private mealTemplateService: MealTemplateService) { }
}
