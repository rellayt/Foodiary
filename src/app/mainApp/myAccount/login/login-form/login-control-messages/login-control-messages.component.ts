import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { LoginValidationService } from '../../../../../services/validation/login-validation.service';

@Component({
  selector: 'login-control-messages',
  template: '<mat-error *ngIf="errorMessage !== null">{{errorMessage}}</mat-error>',
  styleUrls: ['./login-control-messages.component.scss']
})

export class LoginControlMessagesComponent implements OnInit {
  @Input() control: FormControl;
  constructor() { }
  ngOnInit() {
  }

  get errorMessage() {
    for (const propertyName in this.control.errors) {
      if (this.control.errors.hasOwnProperty(propertyName) && this.control.touched) {
        return LoginValidationService.getValidatorErrorMessage(
          propertyName,
          this.control.errors[propertyName]
        );
      }
    }
    return null;
  }
}
