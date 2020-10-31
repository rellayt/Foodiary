import { NgModule } from '@angular/core';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatMenuModule } from '@angular/material/menu';

const MaterialComponents = [
  MatToolbarModule,
  MatButtonModule,
  MatCardModule,
  MatDialogModule,
  MatInputModule,
  MatFormFieldModule,
  MatIconModule,
  MatTabsModule,
  MatMenuModule
];

@NgModule({
  imports: [
    MaterialComponents,
  ],
  exports: [MaterialComponents]
})
export class MaterialModule { }
