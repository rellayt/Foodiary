import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule, RoutingComponents } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './header/navbar/navbar.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material/material.module';
import { LogoComponent } from './layout/logo/logo.component';
import { BackgroundComponent } from './layout/background/background.component';
import { RegisterDialogComponent } from './auth/register/register.component';
import { LoginFormComponent } from './auth/login/login-form/login-form.component';
import { RegisterFormComponent } from './auth/register/register-form/register-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginValidationService } from './services/validation/login-validation.service';
import { ValidationFeedbackComponent } from './validation/validation-feedback.component';
import { ForgotPasswordDialogComponent } from './auth/login/forgot-password/forgot-password.component';
import { RegisterValidationService } from './services/validation/register-validation.service';
import { LoginDialogComponent } from './auth/login/login.component';
import { HttpClientModule } from '@angular/common/http';
import { UserService } from './services/server/user.service';
import { DiaryComponent } from './diary/diary.component';
import { ProfileComponent } from './profile/profile.component';
import { SubNavigationComponent } from './layout/sub-navigation/sub-navigation.component';
import { ProfileNavigationComponent } from './profile/profile-navigation/profile-navigation.component';
import { AboutMeComponent } from './profile/about-me/about-me.component';
import { ProfileEditorComponent } from './profile/profile-editor/profile-editor.component';
import { CaloryFormComponent } from './profile/profile-editor/calory-form/calory-form.component';
import { CommaReplacerDirective } from './directives/replacer.directive';
import { CaloryHelpDialogComponent } from './profile/profile-editor/calory-form/calory-help-dialog/calory-help-dialog.component';
import { PersonalDataFormComponent } from './profile/profile-editor/personal-data-form/personal-data-form.component';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { MeasurementFormComponent } from './profile/profile-editor/measurement-form/measurement-form.component';
import { GuestNavbarComponent } from './layout/headers/guest-navbar/guest-navbar.component';
import { UserNavbarComponent } from './layout/headers/user-navbar/user-navbar.component';

const dialogComponents = [
  LoginDialogComponent, RegisterDialogComponent, ForgotPasswordDialogComponent
];

const formComponents = [
  LoginFormComponent, RegisterFormComponent
];
const mainComponents = [
  SubNavigationComponent
];
@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LogoComponent,
    BackgroundComponent,
    RoutingComponents,
    dialogComponents,
    formComponents,
    DiaryComponent,
    ProfileComponent,
    mainComponents,
    ProfileNavigationComponent,
    AboutMeComponent,
    ProfileEditorComponent,
    CaloryFormComponent,
    CommaReplacerDirective,
    CaloryHelpDialogComponent,
    PersonalDataFormComponent,
    ValidationFeedbackComponent,
    MeasurementFormComponent,
    GuestNavbarComponent,
    UserNavbarComponent,
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
  providers: [LoginValidationService, RegisterValidationService, UserService, { provide: MAT_DATE_LOCALE, useValue: 'pl-PL' }, {
    provide: DateAdapter,
    useClass: MomentDateAdapter,
    deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
  },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
