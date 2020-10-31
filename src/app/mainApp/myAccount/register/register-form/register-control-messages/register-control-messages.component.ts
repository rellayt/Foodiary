import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { RegisterValidationService } from 'src/app/services/validation/register-validation.service';

@Component({
  selector: 'register-control-messages',
  template: '<mat-error *ngIf="errorMessage !== null">{{errorMessage}}</mat-error>',
  styleUrls: ['./register-control-messages.component.scss']
})
export class RegisterControlMessagesComponent {
  @Input() control: FormControl;
  constructor() { }

  get errorMessage() {
    // tslint:disable-next-line: forin
    for (const propertyName in this.control.errors) {
      if (this.control.errors.hasOwnProperty(propertyName) && this.control.touched) {
        return RegisterValidationService.getValidatorErrorMessage(propertyName, this.control.errors[propertyName]);
      }
    }
    return null;
  }

}
