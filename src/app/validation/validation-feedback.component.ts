import { Component, Input, OnInit, Optional } from '@angular/core';
import { AbstractControl, FormGroupDirective } from '@angular/forms';
import { config } from './validation-config';

@Component({
  selector: 'validation-feedback',
  templateUrl: './validation-feedback.component.html',
})

export class ValidationFeedbackComponent implements OnInit {

  @Input()
  control: AbstractControl

  @Input()
  controlName: string

  get errorMessage() {
    for (const property in this.control.errors) {
      const hasError = this.control.errors.hasOwnProperty(property) && this.control.touched
      if (hasError && property in config) return config[property]
    }
    return null;
  }

  constructor(@Optional() private formGroup: FormGroupDirective) { }

  ngOnInit() {
    if (!this.control && !this.controlName) {
      throw new Error('Validation Feedback must have [control] or [controlName] inputs')
    } else {
      if (this.controlName && this.formGroup) {
        this.control = this.formGroup.form.get(this.controlName)
      }
    }
  }
}
