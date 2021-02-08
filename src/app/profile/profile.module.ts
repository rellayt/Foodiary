import { MaterialModule } from './../material/material.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileComponent } from './profile.component';
import { ProfileNavigationComponent } from './profile-navigation/profile-navigation.component';
import { AboutMeComponent } from './about-me/about-me.component';
import { ProfileEditorComponent } from './profile-editor/profile-editor.component';
import { CaloryFormComponent } from './profile-editor/calory-form/calory-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CaloryHelpDialogComponent } from './profile-editor/calory-form/calory-help-dialog/calory-help-dialog.component';
import { PersonalDataFormComponent } from './profile-editor/personal-data-form/personal-data-form.component';
import { MeasurementFormComponent } from './profile-editor/measurement-form/measurement-form.component';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { SettingsComponent } from './settings/settings.component';
import { AppRoutingModule } from '../app-routing.module';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptorService } from '../auth/auth-interceptor.service';
import { ValidationModule } from '../validation/validation.module';

@NgModule({
  declarations: [
    ProfileComponent,
    ProfileNavigationComponent,
    AboutMeComponent,
    ProfileEditorComponent,
    CaloryFormComponent,
    CaloryHelpDialogComponent,
    PersonalDataFormComponent,
    MeasurementFormComponent,
    SettingsComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule,
    ReactiveFormsModule,
    AppRoutingModule,
    ValidationModule
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'pl-PL' },
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },

  ]
})
export class ProfileModule { }