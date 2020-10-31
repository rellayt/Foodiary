import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule, RoutingComponents } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './header/navbar/navbar.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material/material.module';
import { LogoComponent } from './header/navbar/logo/logo.component';
import { BackgroundComponent } from './mainApp/background/background.component';
import { RegisterDialogComponent } from './mainApp/myAccount/register/register.component';
import { LoginFormComponent } from './mainApp/myAccount/login/login-form/login-form.component';
import { RegisterFormComponent } from './mainApp/myAccount/register/register-form/register-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginValidationService } from './services/validation/login-validation.service';
import { LoginControlMessagesComponent } from './mainApp/myAccount/login/login-form/login-control-messages/login-control-messages.component';
import { RegisterControlMessagesComponent } from './mainApp/myAccount/register/register-form/register-control-messages/register-control-messages.component';
import { ForgotPasswordDialogComponent } from './mainApp/myAccount/login/forgot-password/forgot-password.component';
import { RegisterValidationService } from './services/validation/register-validation.service';
import { LoginDialogComponent } from './mainApp/myAccount/login/login.component';
import { HttpClientModule } from '@angular/common/http';
import { UserService } from './services/server/user.service';
import { DiaryComponent } from './mainApp/mainPage/diary/diary.component';
import { ProfileComponent } from './mainApp/mainPage/profile/profile.component';
import { UserNavigationComponent } from './mainApp/mainPage/user-navigation/user-navigation.component';

const dialogComponents = [
  LoginDialogComponent, RegisterDialogComponent, ForgotPasswordDialogComponent
];

const formControlMessageComponents = [
  LoginControlMessagesComponent, RegisterControlMessagesComponent
];

const formComponents = [
  LoginFormComponent, RegisterFormComponent
];
const mainComponents = [
  UserNavigationComponent
];
@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LogoComponent,
    BackgroundComponent,
    RoutingComponents,
    formControlMessageComponents,
    dialogComponents,
    formComponents,
    DiaryComponent,
    ProfileComponent,
    mainComponents,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  providers: [LoginValidationService, RegisterValidationService, UserService],
  bootstrap: [AppComponent]
})
export class AppModule { }
