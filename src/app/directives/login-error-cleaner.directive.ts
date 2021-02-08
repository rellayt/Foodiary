import { Directive, Input, OnInit } from '@angular/core';
import { FormGroupDirective, NgControl } from '@angular/forms';

@Directive({
  selector: '[loginErrorCleaner]'
})
export class LoginErrorCleanerDirective implements OnInit {

  @Input()
  loginErrorCleaner: string

  constructor(private control: NgControl, private formGroup: FormGroupDirective) { }

  ngOnInit() {
    const abstractControl = this.control.control
    const abstractControl_2 = this.formGroup.form.get(this.loginErrorCleaner)

    abstractControl.valueChanges.subscribe(value => {
      if (abstractControl_2.hasError('invalid') || abstractControl_2.hasError('invalid_login')) {
        abstractControl.setErrors(null)
        abstractControl_2.setErrors(null)
      }
    })
  }

}
