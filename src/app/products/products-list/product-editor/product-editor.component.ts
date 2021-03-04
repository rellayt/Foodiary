import { Component, ElementRef, Input, OnInit, Output, ViewChild } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { Product } from '../../../models/products.model';
import { FormBuilder, Validators } from '@angular/forms';
import { ProductService } from 'src/app/services/product.service';
import { SnackBarService } from 'src/app/services/snack-bar.service';
import { ValidationService } from 'src/app/validation/validation.service';
import { CATEGORIES_DATA } from '../../../utility/static-data';
import { fromToOpacityAnimation } from 'src/app/utility/basic-animations';
import { endAnimation } from '../../../utility/basic-animations';

@Component({
  selector: 'app-product-editor',
  templateUrl: './product-editor.component.html',
  styleUrls: ['./product-editor.component.scss']
})
export class ProductEditorComponent implements OnInit {
  @ViewChild('productEditor', { static: true }) productEditor: ElementRef;

  @Input() product: Product
  @Output() closeAction = new EventEmitter()

  productEditorForm: any
  categories = CATEGORIES_DATA

  constructor(private form: FormBuilder, private productService: ProductService,
    private snackBar: SnackBarService, private validation: ValidationService) {
    this.productEditorForm = this.form.group({
      name: this.form.control('', {
        validators: [Validators.required, Validators.pattern("[a-ząćęłńóśź żA-ZĄĆĘŁŃÓŚŹŻ]+[0-9]*"), Validators.minLength(3)],
        updateOn: 'blur'
      }),
      protein: this.form.control(0, [Validators.required, Validators.min(0), Validators.max(100)]),
      carb: this.form.control(0, [Validators.required, Validators.min(0), Validators.max(100)]),
      fat: this.form.control(0, [Validators.required, Validators.min(0), Validators.max(100)]),
      category: this.form.control(null, [Validators.required]),
    })
  }

  ngOnInit(): void {
    this.productEditorForm.patchValue(this.product)
    this.productEditorForm.controls['name'].setAsyncValidators(this.validation.productNameAvailability(this.product.name))
    fromToOpacityAnimation(this.productEditor.nativeElement, 0.8)
  }

  getCalory() {
    const getControlValue = (name: string) => this.productEditorForm.controls[name].value

    return getControlValue('protein') * 4 + getControlValue('carb') * 4 + getControlValue('fat') * 9
  }

  closeEditMode() {
    endAnimation(this.productEditor.nativeElement, 0.45)
    setTimeout(() => this.closeAction.emit(false), 450)
  }

  updateProduct() {
    this.productService.update({ id: this.product.id, ...this.productEditorForm.value })
      .subscribe(res => {
        this.snackBar.open("Produkt został zaktualizowany")
        endAnimation(this.productEditor.nativeElement, 0.45)
        setTimeout(() => this.closeAction.emit(true), 450)
      })
  }
}
