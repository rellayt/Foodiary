import { Component, ElementRef, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Router, RoutesRecognized } from '@angular/router';
import { filter, finalize, takeWhile, tap, switchMap, scan, startWith } from 'rxjs/operators';
import { previousPage } from 'src/app/app.component';
import { endAnimation, startAnimation } from 'src/app/utility/basic-animations';
import { Subscription, combineLatest, timer } from 'rxjs';
import { MealTemplate } from '../../models/mealTemplate.model';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Product } from '../../models/products.model';
import { ProductService } from '../../services/product.service';
import { map } from 'rxjs/internal/operators/map';
import { getCalory } from 'src/app/utility/macro-calculations';
import { FormBuilder } from '@angular/forms';
import { MatTooltipDefaultOptions, MAT_TOOLTIP_DEFAULT_OPTIONS } from '@angular/material/tooltip';
import { fromToOpacityAnimation } from '../../utility/basic-animations';
import { getMacroPercentages } from '../../utility/macro-calculations';
import { deepCopy } from 'src/app/utility/utility';
import { ProductAdditionDialogComponent } from './quick-add-product/product-addition-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { SnackBarService } from '../../services/snack-bar.service';

export const tooltipSettings: MatTooltipDefaultOptions = {
  showDelay: 0,
  hideDelay: 0,
  touchendHideDelay: 0,
};

@Component({
  selector: 'app-meal-template-addition',
  templateUrl: './meal-template-addition.component.html',
  styleUrls: ['./meal-template-addition.component.scss'],
  providers: [
    { provide: MAT_TOOLTIP_DEFAULT_OPTIONS, useValue: tooltipSettings },
  ],
})
export class MealTemplateAdditionComponent implements OnInit, OnDestroy {
  @ViewChild('templateAddition', { static: true }) templateAddition: ElementRef
  @ViewChild('macro', { static: true }) macro: ElementRef
  templateAdditionForm: any

  constructor(private router: Router, private productService: ProductService, private form: FormBuilder, private dialog: MatDialog,
    private snackBar: SnackBarService) {
    this.templateAdditionForm = this.form.group({
      productSearch: this.form.control(''),
      quantity: [{ value: '', disabled: this.selectedProduct === null }],
      calory: [{ value: '', disabled: this.selectedProduct === null }],
    })
  }

  selectedProduct: Product = null
  addProductActivation = false

  routerEvent: Subscription
  time = "12:00"
  loading = false

  mealTemplate: MealTemplate = {
    name: '',
    time: '00:00',
    products: []
  }

  // mealTemplate: MealTemplate = fake_data

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

  options = []

  ngOnInit(): void {
    setTimeout(() => {
      this.templateAddition.nativeElement.scrollTo({ left: 0, top: this.templateAddition.nativeElement.scrollHeight, behavior: 'smooth' }), 205
    }, 5)
    const value = previousPage === "/template/list" ? -20 : 0
    startAnimation(this.templateAddition.nativeElement, 0.35, value)

    this.calculateSummary(this.mealTemplate.products)

    this.routerEvent = this.router.events
      .pipe(filter(event => event instanceof RoutesRecognized))
      .subscribe((event: any) => {
        const nextPage = event.url
        const value = nextPage.split('/')[1] !== 'template' ? 0 : -20

        endAnimation(this.templateAddition.nativeElement, 0.35, value)
      });

    this.templateAdditionForm.controls['quantity'].valueChanges
      .pipe(filter(value => !!this.selectedProduct && value !== this.selectedProduct.quantity && value >= 0 && value !== ''))
      .subscribe((value: number) => {
        value = value === 0 || value === null ? 1 : value
        const nutriments = ['protein', 'carb', 'fat'], { quantity } = this.selectedProduct

        nutriments.forEach(name => this.selectedProduct[name] = this.selectedProduct[name] / quantity * value)

        const { protein, carb, fat } = this.selectedProduct
        this.selectedProduct.quantity = value

        this.selectedProduct.calory = +getCalory(protein, carb, fat).toFixed(1)
        this.templateAdditionForm.controls['calory'].setValue(this.selectedProduct.calory)
        this.createAbstractSummary(this.selectedProduct)
      })

    this.templateAdditionForm.controls['calory'].valueChanges
      .pipe(filter(value => !!this.selectedProduct && value !== this.selectedProduct.calory && value >= 0 && value !== ''))
      .subscribe((value: number) => {
        value = value === 0 || value === null ? 1 : value
        const nutriments = ['protein', 'carb', 'fat'], { calory, quantity, percentages } = this.selectedProduct

        nutriments.forEach((name, i) => this.selectedProduct[name] = ((value * percentages[i]) / 100) / (i !== 2 ? 4 : 9))

        this.selectedProduct.quantity = (value * quantity) / calory
        this.selectedProduct.calory = value
        this.templateAdditionForm.controls['quantity'].setValue(this.selectedProduct.quantity)
        this.createAbstractSummary(this.selectedProduct)
      })


    this.templateAdditionForm.controls['productSearch'].valueChanges
      .pipe(
        tap(value => {
          if (this.selectedProduct && this.selectedProduct.name !== value) this.resetSelectedProduct()

          this.productService.setQuery(value)
          this.loading = true
        }),
        filter((value: string) => !!value && value.length > 2),
        switchMap((value: string) => combineLatest(
          this.productService.searchProducts(),
          this.productService.searchExternalProducts(value)
        )),
        map(([localProducts, externalProducts]) => [
          ...localProducts, ...externalProducts
        ].map(product => ({
          ...product,
          calory: Math.round(getCalory(product.protein, product.carb, product.fat))
        }))),
      )
      .subscribe(data => {
        this.loading = false
        this.options = data;
      })
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

  openProductAdditionDialog(deleteRef: any) {
    const dialogRef = this.dialog.open(ProductAdditionDialogComponent, {
      autoFocus: false,
      disableClose: true,
      width: '800px',
    })
    dialogRef.afterClosed().pipe(
      tap(() => deleteRef._elementRef.nativeElement.blur()),
      filter(Boolean),
    ).subscribe((product: Product) => {
      const { protein, carb, fat } = product
      this.mealTemplate.products.push({ quantity: 100, calory: getCalory(protein, carb, fat), ...product })
      this.calculateSummary(this.mealTemplate.products)
      setTimeout(() => {
        this.templateAddition.nativeElement.scrollTo({ left: 0, top: this.templateAddition.nativeElement.scrollHeight, behavior: 'smooth' }), 205
      }, 50)
    })
  }

  calculateSummary(abstractProducts) {
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
    const nutrimentsPercentage = getMacroPercentages(protein, carb, fat)

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
          .subscribe(value => this.templateSummary[property][name] = Math.round(value))
      }))
  }

  selectProduct(product) {
    const { protein, carb, fat } = product
    this.selectedProduct = { ...product, quantity: 100, percentages: getMacroPercentages(protein, carb, fat) }
    this.templateAdditionForm.patchValue({ productSearch: product.name, quantity: 100, calory: product.calory })
    this.templateAdditionForm.enable()
    this.createAbstractSummary(product)
    fromToOpacityAnimation(this.macro.nativeElement, 1)
  }

  resetSelectedProduct = () => {
    this.templateAdditionForm.controls['quantity'].reset({ value: '', disabled: true })
    this.templateAdditionForm.controls['calory'].reset({ value: '', disabled: true })
    endAnimation(this.macro.nativeElement, 0.4)

    this.calculateSummary(this.mealTemplate.products)
    setTimeout(() => this.selectedProduct = null, 400)
  }

  addProduct() {
    this.mealTemplate.products.push(this.selectedProduct)
    this.resetSelectedProduct()
    this.templateAdditionForm.controls['productSearch'].setValue('')
    setTimeout(() => {
      this.templateAddition.nativeElement.scrollTo({ left: 0, top: this.templateAddition.nativeElement.scrollHeight, behavior: 'smooth' }), 205
    }, 50)
  }

  createAbstractSummary = (product: Product) => {
    const abstractProducts = [...this.mealTemplate.products]
    abstractProducts.push(product)

    this.calculateSummary(abstractProducts)
  }

  removeProduct(product: Product): void {
    const index = this.mealTemplate.products.indexOf(product)

    if (index >= 0) {
      this.mealTemplate.products.splice(index, 1)
      this.calculateSummary(this.mealTemplate.products)
    }
  }

  resetMealTemplate = () => {
    this.mealTemplate = {
      name: '',
      time: '00:00',
      products: []
    }
    this.templateAdditionForm.controls['productSearch'].setValue('')
    if (this.selectedProduct) {
      this.resetSelectedProduct()
    } else {
      this.calculateSummary([])
    }
  }
  drop = (event: CdkDragDrop<Product[]>) =>
    moveItemInArray(this.mealTemplate.products, event.previousIndex, event.currentIndex);

  calculateByQuantity = (value: number, index: number) => {
    try {
      value = value === 0 || value === null ? 1 : value > 1000 ? value / 10 : value > 10000 ? value / 100 : value
      const product = this.mealTemplate.products[index], { quantity } = product

      if ((value <= 1 && quantity <= 1) || this.mealTemplate.products[index].quantity === value) return
      const nutriments = ['protein', 'carb', 'fat']

      nutriments.forEach(name => this.mealTemplate.products[index][name] = (product[name] / quantity) * value)

      const { protein, carb, fat } = this.mealTemplate.products[index]
      this.mealTemplate.products[index].quantity = value

      const calory = +getCalory(protein, carb, fat)

      if (calory > 999) {
        this.snackBar.open('Wyliczona wartość jest zbyt duża, dodaj produkt ponownie', 2800, true)
        this.mealTemplate.products.splice(index, 1)
      } else {
        this.mealTemplate.products[index].calory = calory
        this.calculateSummary(this.mealTemplate.products)
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

      this.mealTemplate.products[index].quantity = (value * quantity) / calory
      this.mealTemplate.products[index].calory = Math.round(value)
      this.calculateSummary(this.mealTemplate.products)
    } catch (err) {
      console.error(err);
    }
  }

  ngOnDestroy() {
    this.routerEvent.unsubscribe()
  }
}

const fake_data: MealTemplate =
{
  name: "Obiadek",
  time: "13:45",
  products: [
    {
      calory: 390,
      quantity: 100,
      name: 'Pierogi',
      protein: 25,
      carb: 50,
      fat: 10,
      percentages: [
        25.6,
        51.3,
        23.1
      ]
    },
    {
      calory: 70,
      quantity: 0,
      name: 'Truskawki',
      protein: 1,
      carb: 88,
      fat: 14
    },
    {
      calory: 155,
      quantity: 240,
      name: 'Banany',
      protein: 10,
      carb: 48,
      fat: 59
    }
  ]
}
const fake_options: Product[] = [
  {
    calory: 450,
    name: 'Ciasto',
    protein: 10,
    carb: 45,
    fat: 12
  },
  {
    calory: 70,
    quantity: 0,
    name: 'Placki',
    protein: 1,
    carb: 88,
    fat: 14
  },
  {
    calory: 155,
    name: 'Mąka',
    protein: 10,
    carb: 48,
    fat: 59
  }
]


