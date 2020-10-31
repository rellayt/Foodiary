import { Component, OnDestroy, OnInit, ViewChild, } from '@angular/core';
import { MatDialog, } from '@angular/material/dialog';
import { LoginFormComponent } from './login-form/login-form.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit, OnDestroy {

  constructor(public dialog: MatDialog) { }
  ngOnInit() {
    const dialogRef = this.dialog.open(LoginDialogComponent);
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  ngOnDestroy() {
    this.dialog.closeAll();
  }

}
@Component({
  templateUrl: './login-dialog.component.html',
  styleUrls: ['./login-dialog.component.scss'],

})
export class LoginDialogComponent implements OnInit {

  @ViewChild(LoginFormComponent) loginForm: LoginFormComponent;


  constructor() { }

  ngOnInit() {
  }

}
