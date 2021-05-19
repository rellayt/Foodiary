import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { TooltipPosition } from '@angular/material/tooltip';
import { validateEmail } from '../../validation/validators';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
})
export class ForgotPasswordComponent implements OnInit {

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
    this.dialog.open(ForgotPasswordDialogComponent, {
      height: '320px',
      width: '500px',
      disableClose: true
    });
  }
}
@Component({
  templateUrl: './forgot-password-dialog.component.html',
  styleUrls: ['./forgot-password-dialog.scss'],
})
export class ForgotPasswordDialogComponent implements OnInit {

  email = new FormControl('', [Validators.required, validateEmail()]);
  constructor() { }

  tooltipPosition: TooltipPosition = 'above';

  get errorMessage() {
    if (this.email.hasError('required')) return 'Pole jest wymagane';
    if (this.email.hasError('invalidEmailAddress')) return 'Niepoprawny adres e-mail';
    return null;
  }

  validateField = () => {
    if (!this.email.touched) this.email.markAsTouched();
  }

  ngOnInit() {
  }

  submit = () => {
    if (!this.email.valid) {
      this.validateField();
    }
  }
}
