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
import { RegisterExtendedComponent } from './register-extended/register-extended.component';
import { CaloryRegisterFormComponent } from './register-extended/calory-register-form/calory-register-form.component';
import { DirectivesModule } from '../directives/directives.module';


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
    DirectivesModule,
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
    LoginErrorCleanerDirective,
    RegisterExtendedComponent,
    CaloryRegisterFormComponent
  ],
  exports: [
    dialogComponents,
    formComponents,
    standardComponents,
    SingleErrorCleanerDirective,
    LoginErrorCleanerDirective,
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptorService,
    multi: true,
  },]
})
export class AuthModule { }
