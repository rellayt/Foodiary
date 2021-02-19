import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, AbstractControl, FormArray } from '@angular/forms';

@Component({
  selector: 'app-products-addition',
  templateUrl: './products-addition.component.html',
  styleUrls: ['./products-addition.component.scss']
})
export class ProductsAdditionComponent implements OnInit {

  productsAddition: any

  categories = [
    { value: 1, viewValue: 'Nabiał i jaja' },
    { value: 2, viewValue: 'Mięso, wędliny i ryby' },
    { value: 3, viewValue: 'Produkty zbożowe' },
    { value: 4, viewValue: 'Owoce i warzywa' },
    { value: 5, viewValue: 'Orzechy i nasiona' },
    { value: 6, viewValue: 'Tłuszcze' },
    { value: 7, viewValue: 'Gotowe dania' },
    { value: 8, viewValue: 'Napoje i słodycze' },
    { value: 9, viewValue: 'Odżywki' },
    { value: 10, viewValue: 'Inne' },
  ]

  constructor(private form: FormBuilder) {
    this.productsAddition = this.form.group({
      products: this.form.array([
        this.createProductGroup()
      ])
    })
  }

  createProductGroup = () => this.form.group({
    name: this.form.control('', [Validators.required, Validators.pattern("[a-zA-Z]+"), Validators.min(3)]),
    calories: this.form.control({ value: 0, disabled: true }),
    protein: this.form.control(0, [Validators.required, Validators.min(0), Validators.max(100)]),
    carb: this.form.control(0, [Validators.required, Validators.min(0), Validators.max(100)]),
    fat: this.form.control(0, [Validators.required, Validators.min(0), Validators.max(100)]),
    category: this.form.control(null, [Validators.required]),
  })

  getControlList = (abstractControl: AbstractControl) =>
    abstractControl instanceof FormArray ? abstractControl.controls : []

  addProduct = (products: FormArray) => products.push(this.createProductGroup())

  removeProduct = (index: number) => this.productsAddition.controls['products'].removeAt(index)

  getControl = (index: number, name: string) => this.productsAddition.controls['products'].at(index).controls[name]

  getCalory(index: number) {
    const getControlValue = (name: string) => this.productsAddition.controls['products'].at(index).controls[name].value

    return getControlValue('protein') * 4 + getControlValue('carb') * 4 + getControlValue('fat') * 9
  }

  ngOnInit(): void {
  }

}
