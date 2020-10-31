import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
})
export class RegisterComponent implements OnInit {

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
    this.dialog.open(RegisterDialogComponent);
  }

}

@Component({
  selector: 'app-register',
  templateUrl: './register-dialog.component.html',
  styleUrls: ['./register-dialog.component.scss']
})
export class RegisterDialogComponent implements OnInit {


  constructor() { }

  ngOnInit(): void {
  }
}
