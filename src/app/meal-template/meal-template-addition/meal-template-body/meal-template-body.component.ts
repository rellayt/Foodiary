import { Component, ElementRef, OnInit, ViewChild, Output, Input } from '@angular/core';
import { filter, tap, } from 'rxjs/operators';
import { MealTemplate } from '../../../models/mealTemplate.model';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Product } from '../../../models/products.model';
import { getCalory } from 'src/app/utility/macro-calculations';
import { MatTooltipDefaultOptions, MAT_TOOLTIP_DEFAULT_OPTIONS } from '@angular/material/tooltip';
import { ProductAdditionDialogComponent } from '../quick-add-product/product-addition-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { SnackBarService } from '../../../services/snack-bar.service';
import { MealTemplateSearchComponent } from '../meal-template-search/meal-template-search.component';
import { EventEmitter } from '@angular/core';

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
  @ViewChild('productSearch') productSearch: MealTemplateSearchComponent;
  @Output() scrollDown: EventEmitter<Boolean> = new EventEmitter()

  constructor(private dialog: MatDialog, private snackBar: SnackBarService) { }

  addProductActivation = false

  time = "12:00"
  loading = false

  @Input() mealTemplate: MealTemplate = {
    name: '',
    time: '00:00',
    products: []
  }

  // mealTemplate: MealTemplate = fake_data
  abstractProducts: Product[]

  options = []

  ngOnInit(): void {
    this.abstractProducts = [...this.mealTemplate.products]
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
    this.mealTemplate = {
      name: '',
      time: '00:00',
      products: []
    }
    this.productSearch.productSearchForm.controls['query'].setValue('')

    this.productSearch.selectedProduct ? this.productSearch.resetSelectedProduct() : this.abstractProducts = []
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
    console.log(this.mealTemplate);

  }

}

const fake_data: MealTemplate =
{
  name: "Obiadek",
  time: "13:45",
  products: [
    {
      calory: 0,
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
      calory: 0,
      quantity: 25,
      name: 'Truskawki',
      protein: 47,
      carb: 25,
      fat: 15
    },
    {
      calory: 0,
      quantity: 240,
      name: 'Banany',
      protein: 15,
      carb: 28,
      fat: 29
    },
    {
      calory: 0,
      quantity: 240,
      name: 'Banany',
      protein: 15,
      carb: 28,
      fat: 29
    },
    {
      calory: 0,
      quantity: 240,
      name: 'Banany',
      protein: 15,
      carb: 28,
      fat: 29
    },
    {
      calory: 0,
      quantity: 240,
      name: 'Banany',
      protein: 15,
      carb: 28,
      fat: 29
    },
    {
      calory: 0,
      quantity: 240,
      name: 'Banany',
      protein: 15,
      carb: 28,
      fat: 29
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
