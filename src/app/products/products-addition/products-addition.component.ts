import { Component, OnInit, ViewChild, ElementRef, QueryList, ViewChildren, OnDestroy } from '@angular/core';
import { FormBuilder, Validators, AbstractControl, FormArray } from '@angular/forms';
import { productNameAvailability } from 'src/app/validation/validators';
import { ProductService } from '../../services/product.service';
import { ValidationService } from '../../validation/validation.service';
import { SnackBarService } from '../../services/snack-bar.service';
import { startAnimation, fromToOpacityAnimation, endAnimation } from '../../utility/basic-animations';
import { CATEGORIES_DATA } from '../../utility/static-data';
import { previousPage } from 'src/app/app.component';
import { Router, RoutesRecognized } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-products-addition',
  templateUrl: './products-addition.component.html',
  styleUrls: ['./products-addition.component.scss']
})
export class ProductsAdditionComponent implements OnInit, OnDestroy {

  @ViewChild('productAddition', { static: true }) productAddition: ElementRef
  @ViewChild('buttons', { static: true }) buttons: ElementRef
  @ViewChildren('groups') groups: QueryList<ElementRef>

  productsAddition: any
  routerEvent: Subscription

  categories = CATEGORIES_DATA

  ngOnInit(): void {
    const value = previousPage === "/products/list" ? -20 : 0
    startAnimation(this.productAddition.nativeElement, 0.35, value)

    this.routerEvent = this.router.events
      .pipe(filter(event => event instanceof RoutesRecognized))
      .subscribe((event: any) => {
        const nextPage = event.url
        const value = nextPage.split('/')[1] !== 'products' ? 0 : -20

        endAnimation(this.productAddition.nativeElement, 0.35, value)
      });

    this.productsAddition.controls['products'].push(this.createProductGroup())
  }

  constructor(private form: FormBuilder, private productService: ProductService,
    private validation: ValidationService, private snackBar: SnackBarService, private router: Router) {
    this.productsAddition = this.form.group({
      products: this.form.array([])
    })
  }

  ngOnDestroy() {
    this.routerEvent.unsubscribe()
  }
  createProductGroup = () => this.form.group({
    name: this.form.control('', {
      validators: [Validators.required, Validators.pattern("[a-ząćęłńóśźż A-ZĄĆĘŁŃÓŚŹŻ]+[0-9]*"), Validators.minLength(3), productNameAvailability(this.productsAddition)],
      updateOn: 'blur',
      asyncValidators: this.validation.productNameAvailability()
    }),
    protein: this.form.control(0, [Validators.min(0), Validators.max(100)]),
    carb: this.form.control(0, [Validators.min(0), Validators.max(100)]),
    fat: this.form.control(0, [Validators.min(0), Validators.max(100)]),
    category: this.form.control(null, [Validators.required]),
  })

  getControlList = (abstractControl: AbstractControl) =>
    abstractControl instanceof FormArray ? abstractControl.controls : []

  addProduct = (products: FormArray) => {
    endAnimation(this.buttons.nativeElement, 0.2)

    setTimeout(() => {
      products.push(this.createProductGroup())
      fromToOpacityAnimation(this.buttons.nativeElement, 0.5)
    }, 200)
    setTimeout(() => {
      fromToOpacityAnimation(this.groups.toArray()[products.length - 1].nativeElement, 1.5)
      this.productAddition.nativeElement.scrollTo({ left: 0, top: this.productAddition.nativeElement.scrollHeight, behavior: 'smooth' }), 205
    }, 200)
  }

  removeProduct = (index: number) => {
    const products = this.productsAddition.controls['products']
    endAnimation(this.groups.toArray()[index].nativeElement, 0.3)
    endAnimation(this.buttons.nativeElement, 0.2)
    setTimeout(() => {
      products.removeAt(index)
      fromToOpacityAnimation(this.buttons.nativeElement, 0.5)
    }, 310)
  }

  getControl = (index: number, name: string) => this.productsAddition.controls['products'].at(index).controls[name]

  getCalory(index: number) {
    const getControlValue = (name: string) => this.productsAddition.controls['products'].at(index).controls[name].value

    return getControlValue('protein') * 4 + getControlValue('carb') * 4 + getControlValue('fat') * 9
  }

  save() {
    this.productService.insertMany(this.productsAddition.value["products"]).subscribe(res => {
      endAnimation(this.buttons.nativeElement, 0.3)
      this.groups.toArray().forEach(el => endAnimation(el.nativeElement, 0.3))

      const products = this.productsAddition.controls["products"]
      this.snackBar.open(products.length == 1 ? "Produkt został dodany" : "Produkty zostały dodane")

      setTimeout(() => {
        products.clear()
        products.push(this.createProductGroup())
        fromToOpacityAnimation(this.groups.toArray()[0].nativeElement, 0.5)
        fromToOpacityAnimation(this.buttons.nativeElement, 0.2)
      }, 300)
    })
  }

}
