import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ValidationFeedbackComponent } from './validation-feedback.component';
import { MaterialModule } from '../material/material.module';
import { ValidationService } from './validation.service';
import { FieldsMatchDirective } from './fields-match.directive';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
  ],
  declarations: [ValidationFeedbackComponent, FieldsMatchDirective],
  exports: [
    ValidationFeedbackComponent, FieldsMatchDirective
  ],
  providers: [
    ValidationService
  ]
})
export class ValidationModule { }
