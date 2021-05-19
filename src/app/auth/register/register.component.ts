import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TooltipPosition } from '@angular/material/tooltip';
import { AuthService } from '../auth.service';
import { takeUntil, takeWhile, tap } from 'rxjs/operators';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
})
export class RegisterComponent implements OnInit {

  constructor(private dialog: MatDialog, private auth: AuthService) { }

  ngOnInit(): void {
    this.dialog.open(RegisterDialogComponent, { disableClose: true });
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
