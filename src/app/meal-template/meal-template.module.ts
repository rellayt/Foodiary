import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MealTemplateRoutingModule } from './meal-template-routing.module';
import { MealTemplateListComponent } from './meal-template-list/meal-template-list.component';
import { MealTemplateAdditionComponent } from './meal-template-addition/meal-template-addition.component';
import { MealTemplateComponent } from './meal-template.component';
import { MaterialModule } from '../material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ValidationModule } from '../validation/validation.module';
import { DirectivesModule } from '../directives/directives.module';
import { DelayResolve } from '../resolves/delay-resolve';
import { MealTemplateNavigationComponent } from './meal-template-navigation/meal-template-navigation.component';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { ProductAdditionDialogComponent } from './meal-template-addition/quick-add-product/product-addition-dialog.component';

@NgModule({
  declarations: [
    MealTemplateListComponent,
    MealTemplateAdditionComponent,
    MealTemplateComponent,
    MealTemplateAdditionComponent,
    MealTemplateNavigationComponent,
    ProductAdditionDialogComponent
  ],
  imports: [
    CommonModule,
    MealTemplateRoutingModule,
    FormsModule,
    MaterialModule,
    ReactiveFormsModule,
    ValidationModule,
    DirectivesModule,
    NgxMaterialTimepickerModule.setLocale('pl-PL')
  ],
  providers: [
    DelayResolve
  ]
})
export class MealTemplateModule { }
