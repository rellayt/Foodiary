import { Component, OnDestroy, OnInit, ViewChild, } from '@angular/core';
import { MatDialog, } from '@angular/material/dialog';
import { LoginFormComponent } from './login-form/login-form.component';
import { Router } from '@angular/router';
import { TooltipPosition } from '@angular/material/tooltip';
import { OnceClickedService } from '../../../services/animation/once-clicked.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit, OnDestroy {

  constructor(public dialog: MatDialog, private onceClickedService: OnceClickedService) { }

  ngOnInit() {
    this.dialog.open(LoginDialogComponent, { disableClose: true, restoreFocus: false });
    this.onceClickedService.changeOnceClickedSubject(true);
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
