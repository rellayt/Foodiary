import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { UserService } from '../server/user.service';

@Injectable({
  providedIn: 'root'
})
export class LoginValidationService {
  static getValidatorErrorMessage(validatorName: string, validatorValue?: any) {
    const config = {
      required: 'Pole jest wymagane',
      invalidData: 'Nieprawidłowe dane logowania',
    };
    return config[validatorName];
  }
  static emptyFieldsValidator(loginForm) {
    if (loginForm.valid) return;

    const [login, password] = [loginForm.get('login'), loginForm.get('password')];

    if (!login.touched) login.touched = true;
    if (!password.touched) password.touched = true;
  }
  // static loginValidator(controlName: string, userService: UserService) {
  //   return (formGroup: FormGroup) => {
  //     const control = formGroup.controls[controlName];
  //     if (control.value) {
  //       userService.checkLogin(control.value).subscribe(({ available }) => {
  //         if (available) {
  //           control.markAsPristine();
  //           /*             control.setErrors({ invalidLogin: true });
  //                       control.setErrors({ invalidData: true }); */
  //         }
  //       });
  //     }
  //   };
  // }
}
