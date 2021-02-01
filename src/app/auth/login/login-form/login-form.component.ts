import { Component, DoCheck } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/server/user.service';
import { LoginValidationService } from '../../../services/validation/login-validation.service';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss'],
  providers: [UserService, { provide: 'recaptchaContainerId', useValue: 'recaptcha-container' }],
})
export class LoginFormComponent implements DoCheck {

  loginForm: any;

  login = '';
  password = '';
  hide = true;

  config = {
    required: 'Pole jest wymagane',
    invalidData: 'Nieprawidłowe dane logowania',
  };

  constructor(private formBuilder: FormBuilder, private userService: UserService, private router: Router, public loginValidation: LoginValidationService) {
    this.loginForm = this.formBuilder.group({
      login: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  ngDoCheck(): void {
    if (this.loginForm.controls[`password`].touched && this.loginForm.controls[`login`].touched) {
      this.checkForReset();
    }
  }

  checkForReset = () => {
    if (this.loginForm.controls[`password`].touched && this.password === null && this.login != null) {
      this.loginForm.controls[`password`].reset();
    }

    if (this.loginForm.controls[`login`].touched && this.login === null && this.password != null) {
      this.loginForm.controls[`login`].reset();
    }
  }

  loginSubmit = () => {
    LoginValidationService.emptyFieldsValidator(this.loginForm);


    this.userService.login(this.loginForm.value)
      .subscribe(
        data => {
          const { token } = JSON.parse(JSON.stringify(data));
          localStorage.setItem('token', token);
          this.userService.changeLoginSubject(true);
          this.router.navigate(['profile']);
        },
        error => {
          this.loginForm.reset();
          this.loginForm.controls[`login`].touched = true;
          this.loginForm.controls[`password`].touched = true;
          this.loginForm.controls[`login`].setErrors({ invalid: true });
          this.loginForm.controls[`password`].setErrors({ invalidData: true });
        }
      );
  }
  onSubmit() {

  }
}
