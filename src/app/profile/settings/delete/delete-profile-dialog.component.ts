import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { timer } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AuthService } from '../../../auth/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { UserService } from '../../../user/user.service';

@Component({
  selector: 'app-delete',
  templateUrl: './delete-profile-dialog.component.html',
  styleUrls: ['./delete-profile-dialog.component.scss']
})
export class DeleteProfileDialogComponent implements OnInit {

  consent = new FormControl(false)

  password = new FormControl('', {
    validators: [Validators.required, Validators.minLength(6)],
    updateOn: 'blur'
  })

  hide = true
  loading = false

  constructor(private userService: UserService, private _snackBar: MatSnackBar, private matDialog: MatDialog) { }

  ngOnInit(): void {
  }

  delete() {
    this.loading = true
    timer(500).pipe(
      switchMap(() => this.userService.delete(this.password.value)),
    ).subscribe(data => {
      this._snackBar.open("Konto zostało usunięte", "X", {
        duration: 1000,
        horizontalPosition: 'end',
        verticalPosition: 'bottom',
      });
      this.matDialog.closeAll()
    }, error => {
      this.loading = false;
      this.password.setErrors({ invalid_password: true })
    })
  }
}
