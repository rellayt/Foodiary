import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { filter, map, switchMap, tap } from 'rxjs/operators';
import { Product } from 'src/app/models/products.model';
import { ProductService } from 'src/app/services/product.service';
import { endAnimation, fromToOpacityAnimation } from 'src/app/utility/basic-animations';
import { getCalory, getMacroPercentages } from 'src/app/utility/macro-calculations';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'app-meal-template-search',
  templateUrl: './meal-template-search.component.html',
  styleUrls: ['./meal-template-search.component.scss']
})
export class MealTemplateSearchComponent implements OnInit {
  @ViewChild('macro', { static: true }) macro: ElementRef
  @Output() abstractProductEmitter = new EventEmitter()
  @Output() addProductEmitter = new EventEmitter()

  selectedProduct: Product = null
  productSearchForm: any
  loading = false
  options = []

  constructor(private form: FormBuilder, private productService: ProductService) {
    this.productSearchForm = this.form.group({
      query: this.form.control(''),
      quantity: [{ value: '', disabled: this.selectedProduct === null }],
      calory: [{ value: '', disabled: this.selectedProduct === null }],
    })
  }

  selectProduct(product) {
    this.selectedProduct = { ...product, quantity: 100, percentages: getMacroPercentages(product) }
    this.productSearchForm.patchValue({ query: product.name, quantity: 100, calory: product.calory })
    this.productSearchForm.enable()
    this.abstractProductEmitter.emit(this.selectedProduct)
    fromToOpacityAnimation(this.macro.nativeElement, 1)
  }

  ngOnInit(): void {
    this.productSearchForm.controls['query'].valueChanges
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
          calory: Math.round(getCalory(product))
        }))),
      )
      .subscribe(data => {
        this.loading = false
        this.options = data;
      })

    this.productSearchForm.controls['quantity'].valueChanges
      .pipe(filter(value => !!this.selectedProduct && value !== this.selectedProduct.quantity && value >= 0 && value !== ''))
      .subscribe((value: number) => {
        value = value === 0 || value === null ? 1 : value
        const nutriments = ['protein', 'carb', 'fat'], { quantity } = this.selectedProduct

        nutriments.forEach(name => this.selectedProduct[name] = this.selectedProduct[name] / quantity * value)

        this.selectedProduct.quantity = value

        this.selectedProduct.calory = +getCalory(this.selectedProduct).toFixed(1)
        this.productSearchForm.controls['calory'].setValue(this.selectedProduct.calory)
        this.abstractProductEmitter.emit(this.selectedProduct)
      })

    this.productSearchForm.controls['calory'].valueChanges
      .pipe(filter(value => !!this.selectedProduct && value !== this.selectedProduct.calory && value >= 0 && value !== ''))
      .subscribe((value: number) => {
        value = value === 0 || value === null ? 1 : value
        const nutriments = ['protein', 'carb', 'fat'], { calory, quantity, percentages } = this.selectedProduct

        nutriments.forEach((name, i) => this.selectedProduct[name] = ((value * percentages[i]) / 100) / (i !== 2 ? 4 : 9))

        this.selectedProduct.quantity = (value * quantity) / calory
        this.selectedProduct.calory = value
        this.productSearchForm.controls['quantity'].setValue(this.selectedProduct.quantity)
        this.abstractProductEmitter.emit(this.selectedProduct)
      })
  }

  resetSelectedProduct = () => {
    this.productSearchForm.controls['quantity'].reset({ value: '', disabled: true })
    this.productSearchForm.controls['calory'].reset({ value: '', disabled: true })
    endAnimation(this.macro.nativeElement, 0.4)

    this.abstractProductEmitter.emit(null)
    setTimeout(() => this.selectedProduct = null, 400)
  }

  addProduct() {
    this.addProductEmitter.emit(this.selectedProduct)
    this.resetSelectedProduct()
    this.productSearchForm.controls['query'].setValue('')
  }

}
