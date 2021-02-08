import { Directive, ElementRef, Input, OnInit } from '@angular/core';
import { AbstractControl, FormGroupDirective } from '@angular/forms';

@Directive({
  selector: '[singleErrorCleaner]'
})
export class SingleErrorCleanerDirective implements OnInit {

  @Input()
  singleErrorCleaner: string
  abstractControl: AbstractControl

  constructor(private element: ElementRef, private formGroup: FormGroupDirective) { }

  ngOnInit() {
    if (this.singleErrorCleaner && this.formGroup) {
      this.abstractControl = this.formGroup.form.get(this.singleErrorCleaner)
    }
    this.element.nativeElement.addEventListener('click', () => this.abstractControl.markAsUntouched())
  }

}
