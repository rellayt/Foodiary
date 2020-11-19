import { User } from './../../../shared/models/user.model';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { UserService } from 'src/app/services/server/user.service';
import { couldStartTrivia } from 'typescript';
import { LoginValidationService } from '../../../../services/validation/login-validation.service';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss'],
  providers: [UserService, { provide: 'recaptchaContainerId', useValue: 'recaptcha-container' }],
})
export class LoginFormComponent implements OnInit {

  loginForm: any;

  login = '';
  password = '';

  constructor(private formBuilder: FormBuilder, private userService: UserService, private router: Router) {
    this.loginForm = this.formBuilder.group({
      login: ['', Validators.required],
      password: ['', Validators.required],
    }, /* {
      validator: [LoginValidationService.loginValidator('login', userService)]
    } */);
  }

  ngOnInit(): void {
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
          this.loginForm.controls[`login`].setErrors({ invalid: true });
          this.loginForm.controls[`password`].setErrors({ invalidData: true });
        }
      );
  }
  onSubmit() {

  }
}
