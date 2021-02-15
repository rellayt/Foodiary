import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { first, switchMap } from 'rxjs/operators';
import { AuthService } from '../../auth.service';
import { timer } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss'],
  providers: [{ provide: 'recaptchaContainerId', useValue: 'recaptcha-container' }],
})
export class LoginFormComponent {

  loginForm: any
  profileUrl = 'profile'

  hide = true
  loading = false;

  constructor(private form: FormBuilder, private auth: AuthService,
    private router: Router, private _snackBar: MatSnackBar) {
    this.loginForm = this.form.group({
      login: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  login() {
    this.loading = true
    timer(500).pipe(
      switchMap(() => this.auth.login(this.loginForm.value)),
      first()
    ).subscribe(data => {
      this._snackBar.open("Zalogowano", "X", {
        duration: 1500,
        horizontalPosition: 'end',
        verticalPosition: 'bottom',
      });
      this.router.navigate([this.profileUrl])
    }, error => {
      this.loading = false;
      this.loginForm.controls[`login`].setErrors({ invalid: true });
      this.loginForm.controls[`password`].setErrors({ invalid_login: true })
    })
  }
}
