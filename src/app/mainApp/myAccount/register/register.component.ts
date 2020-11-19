import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TooltipPosition } from '@angular/material/tooltip';
import { OnceClickedService } from '../../../services/animation/once-clicked.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
})
export class RegisterComponent implements OnInit {

  constructor(private dialog: MatDialog, private onceClickedService: OnceClickedService) { }

  ngOnInit(): void {
    this.dialog.open(RegisterDialogComponent, { disableClose: true });
    this.onceClickedService.changeOnceClickedSubject(true);
  }

}

@Component({
  selector: 'app-register',
  templateUrl: './register-dialog.component.html',
  styleUrls: ['./register-dialog.component.scss']
})
export class RegisterDialogComponent implements OnInit {

  tooltipPosition: TooltipPosition = 'above';

  constructor() { }

  ngOnInit(): void {
  }
}
