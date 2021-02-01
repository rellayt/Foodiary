import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'validation-feedback',
  template: '<mat-error *ngIf="errorMessage !== null">{{errorMessage}}</mat-error>',
})

export class ValidationFeedbackComponent {
  @Input() control: FormControl;
  @Input() config: any;

  get errorMessage() {
    for (const propertyName in this.control.errors) {
      if (this.control.errors.hasOwnProperty(propertyName) && this.control.touched) {
        return this.getValidatorErrorMessage(propertyName, this.control.errors[propertyName]);
      }
    }
    return null;
  }

  getValidatorErrorMessage(validatorName: string, validatorValue?: any) {
    if (validatorName == 'minlength' || 'maxlength') {
      this.config.minlength = `Minimalna długość pola to ${validatorValue.requiredLength}`;
      this.config.maxlength = `Maksymalna długość to ${validatorValue.requiredLength}`;
    }

    return this.config[validatorName];
  }
}
