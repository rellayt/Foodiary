import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/server/user.service';
import { RegisterValidationService } from '../../../../services/validation/register-validation.service';
import { User } from '../../../shared/models/user.model';
import { Router } from '@angular/router';
import { concatMap, first } from 'rxjs/operators';

@Component({
  selector: 'app-register-form',
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.scss']
})
export class RegisterFormComponent {

  registerForm: any;
  hide = true;
  userToPost: User = {
    userId: null,
    login: '',
    password: '',
    email: ''
  };

  constructor(private formBuilder: FormBuilder, private userService: UserService, private router: Router) {
    this.registerForm = this.formBuilder.group({
      login: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(12), RegisterValidationService.loginValidator]],
      email: ['', [Validators.required, RegisterValidationService.emailValidator]],
      password: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(15)]],
      confirmPassword: ['', [Validators.required]],
    }, {
      validator: [RegisterValidationService.passwordsValidator('password', 'confirmPassword'),
      RegisterValidationService.duplicateLoginValidator('login', this.userService),
      RegisterValidationService.duplicateEmailValidator('email', this.userService)]
    });
  }

  onSubmit() {
    this.userService.postUser(this.registerForm.value).pipe(
      first(),
      concatMap(() => this.userService.login(this.registerForm.value))
    ).subscribe(data => {
      const { token } = JSON.parse(JSON.stringify(data));
      localStorage.setItem('token', token);
      this.userService.changeLoginSubject(true);
      this.router.navigate(['profile']);
      this.registerForm.reset();
    });
  }
}
