import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ValidationModule } from '../validation/validation.module';
import { LoginComponent, LoginDialogComponent } from './login/login.component';
import { RegisterComponent, RegisterDialogComponent } from './register/register.component';
import { ForgotPasswordComponent, ForgotPasswordDialogComponent } from './forgot-password/forgot-password.component';
import { MaterialModule } from '../material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginFormComponent } from './login/login-form/login-form.component';
import { RegisterFormComponent } from './register/register-form/register-form.component';
import { RouterModule } from '@angular/router';
import { SingleErrorCleanerDirective } from '../directives/single-error-cleaner.directive';
import { LoginErrorCleanerDirective } from '../directives/login-error-cleaner.directive';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptorService } from './auth-interceptor.service';


const dialogComponents = [
  LoginDialogComponent,
  RegisterDialogComponent,
  ForgotPasswordDialogComponent
];
const formComponents = [
  LoginFormComponent,
  RegisterFormComponent
];
const standardComponents = [
  LoginComponent, RegisterComponent, ForgotPasswordComponent
]

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    ValidationModule
  ],
  declarations: [
    dialogComponents,
    formComponents,
    standardComponents,
    SingleErrorCleanerDirective,
    LoginErrorCleanerDirective
  ],
  exports: [
    dialogComponents,
    formComponents,
    standardComponents,
    SingleErrorCleanerDirective,
    LoginErrorCleanerDirective
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptorService,
    multi: true,
  },]
})
export class AuthModule { }
