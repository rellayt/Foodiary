import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Product } from 'src/app/models/products.model';
import { ProductService } from 'src/app/services/product.service';
import { SnackBarService } from 'src/app/services/snack-bar.service';
import { endAnimation, fromToOpacityAnimation } from 'src/app/utility/basic-animations';
import { CATEGORIES_DATA } from 'src/app/utility/static-data';
import { ValidationService } from 'src/app/validation/validation.service';

@Component({
  selector: 'product-addition-dialog',
  templateUrl: './product-addition-dialog.component.html',
  styleUrls: ['./product-addition-dialog.component.scss']
})
export class ProductAdditionDialogComponent {

  @ViewChild('addProduct', { static: true }) addProduct: ElementRef;

  productAddition: any
  categories = CATEGORIES_DATA
  canSave = true


  constructor(private form: FormBuilder, private productService: ProductService,
    private snackBar: SnackBarService, private validation: ValidationService) {
    this.productAddition = this.form.group({
      name: this.form.control('', {
        validators: [Validators.required, Validators.pattern("[a-ząćęłńóś źżA-ZĄĆĘŁŃÓŚŹŻ]+[0-9]*"), Validators.minLength(3)],
        updateOn: 'blur',
        asyncValidators: this.validation.productNameAvailability()
      }),
      protein: this.form.control(0, [Validators.required, Validators.min(0), Validators.max(100)]),
      carb: this.form.control(0, [Validators.required, Validators.min(0), Validators.max(100)]),
      fat: this.form.control(0, [Validators.required, Validators.min(0), Validators.max(100)]),
      category: this.form.control(null),
    })
  }


  getCalory() {
    const getControlValue = (name: string) => this.productAddition.controls[name].value

    return getControlValue('protein') * 4 + getControlValue('carb') * 4 + getControlValue('fat') * 9
  }

  saveProduct() {
    this.productService.insertMany([this.productAddition.value]).subscribe(res =>
      this.snackBar.open("Produkt został zapisany"))
    this.productAddition.controls['']
    this.canSave = false
  }

  emitProduct = () => {
    if (this.productAddition.controls['category'].value === null) {
      const { category, ...value } = this.productAddition.value
      return value
    }

    return this.productAddition.value
  }
}
