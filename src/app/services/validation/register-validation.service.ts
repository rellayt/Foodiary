import { Injectable, Injector, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { UserService } from '../server/user.service';

@Injectable({
  providedIn: 'root'
})
export class RegisterValidationService {

  static getValidatorErrorMessage(validatorName: string, validatorValue?: any) {
    const config = {
      required: 'Pole jest wymagane',
      minlength: `Minimalna długość pola to ${validatorValue.requiredLength}`,
      maxlength: `Maksymalna długość to ${validatorValue.requiredLength}`,
      invalidLogin: 'Login musi się składać z liter oraz liczb',
      invalidEmailAddress: 'Niepoprawny adres e-mail',
      invalidPasswordComparison: 'Hasła muszą być takie same',
      duplicateUsername: 'Ta nazwa użytkownika jest zajęta',
      duplicateEmail: 'Ten e-mail jest zajęty.',
    };
    return config[validatorName];
  }

  static loginValidator(control) {
    const pattern = /[^A-Za-z0-9]+/;
    if (control.value) {
      const match = control.value.match(pattern);
      if (match != null) {
        return { invalidLogin: true };
      }
    }
    return null;
  }

  static emailValidator(control) {
    const expression = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/

    return control.value && control.value.match(expression) ? null : { invalidEmailAddress: true };
  }

  static passwordsValidator(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if (matchingControl.errors && !matchingControl.errors.invalidPasswordComparison) return;

      control.value !== matchingControl.value ? matchingControl.setErrors({ invalidPasswordComparison: true }) : '';
    }
  }

  static duplicateLoginValidator(controlName: string, userService: UserService) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      if (control.value) {
        userService.checkLogin(control.value).subscribe(({ available }) => {
          if (!available) control.setErrors({ duplicateUsername: true });
        });
      }
    };
  }

  static duplicateEmailValidator(controlName: string, userService: UserService) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      if (control.value) {
        userService.checkEmail(control.value).subscribe(({ available }) => {
          if (!available) control.setErrors({ duplicateEmail: true });
        });
      }
    };
  }
}
