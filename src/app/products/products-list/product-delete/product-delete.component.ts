import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData } from '../products-list.component';

@Component({
  selector: 'app-product-delete',
  templateUrl: 'product-delete-dialog.component.html',
  styleUrls: ['product-delete-dialog.component.scss']
})
export class ProductDeleteDialogComponent {
  constructor(private dialogRef: MatDialogRef<ProductDeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) { }
}
