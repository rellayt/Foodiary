import { Directive, Input } from '@angular/core';
import { AbstractControl, FormControl, Validator, ValidationErrors, NG_VALIDATORS } from '@angular/forms';

@Directive({
  selector: '[fieldsMatch]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: FieldsMatchDirective,
      multi: true
    }
  ]
})
export class FieldsMatchDirective implements Validator {

  @Input()
  fieldsMatch: FormControl

  @Input()

  validate(abstractControl: AbstractControl): ValidationErrors | null {
    const formGroup = abstractControl.parent.controls
    const control = Object.keys(formGroup).find(name => abstractControl === formGroup[name]) || null

    const match = abstractControl.value === this.fieldsMatch.value

    if (!match && control === 'repeat_password') return { password_match: true }

    if (!match && this.fieldsMatch.touched) this.fieldsMatch.setErrors({ password_match: true })

    if (match) {
      this.removeControlError(abstractControl, 'password_match')
      this.removeControlError(this.fieldsMatch, 'password_match')
    }

    return null;
  }

  removeControlError(control: FormControl | AbstractControl, errorName: string) {
    if (control.errors && control.errors[errorName]) {
      delete control.errors[errorName];
      if (Object.keys(control.errors).length === 0) {
        control.setErrors(null);
      }
    }
  }

  constructor() { }

}
