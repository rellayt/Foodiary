import { Component, OnDestroy, OnInit, ViewChild, } from '@angular/core';
import { MatDialog, } from '@angular/material/dialog';
import { LoginFormComponent } from './login-form/login-form.component';
import { Router } from '@angular/router';
import { TooltipPosition } from '@angular/material/tooltip';

@Component({
  selector: 'app-login',
  template: ``,
})
export class LoginComponent implements OnInit, OnDestroy {

  constructor(public dialog: MatDialog) { }

  ngOnInit() {
    this.dialog.open(LoginDialogComponent, { disableClose: true, restoreFocus: false });
  }

  ngOnDestroy() {
    this.dialog.closeAll();
  }
}
@Component({
  templateUrl: './login-dialog.component.html',
  styleUrls: ['./login-dialog.component.scss'],

})
export class LoginDialogComponent implements OnInit, OnDestroy {

  @ViewChild(LoginFormComponent) loginForm: LoginFormComponent;

  tooltipPosition: TooltipPosition = 'above';
  constructor() { }

  ngOnInit() {
  }
  ngOnDestroy() {
  }
}
