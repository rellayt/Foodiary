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
import { ProductAdditionDialogComponent } from './meal-template-body/quick-add-product/product-addition-dialog.component';
import { MealTemplateSummaryComponent } from './meal-template-body/meal-template-summary/meal-template-summary.component';
import { MealTemplateSearchComponent } from './meal-template-body/meal-template-search/meal-template-search.component';
import { MealTemplateBodyComponent } from './meal-template-body/meal-template-body.component';
import { MealTemplateResolve } from '../resolves/meal-template-resolve';

@NgModule({
  declarations: [
    MealTemplateListComponent,
    MealTemplateAdditionComponent,
    MealTemplateComponent,
    MealTemplateAdditionComponent,
    MealTemplateNavigationComponent,
    ProductAdditionDialogComponent,
    MealTemplateSummaryComponent,
    MealTemplateSearchComponent,
    MealTemplateBodyComponent,
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
    DelayResolve,
    MealTemplateResolve
  ],
  exports: [
    MealTemplateBodyComponent
  ]
})
export class MealTemplateModule { }
