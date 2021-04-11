import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material/material.module';
import { ValidationModule } from '../validation/validation.module';
import { DirectivesModule } from '../directives/directives.module';
import { DelayResolve } from '../resolves/delay-resolve';
import { DiaryComponent } from './diary.component';
import { DiaryNavigationComponent } from './diary-navigation/diary-navigation.component';
import { DiaryAdditionComponent } from './diary-addition/diary-addition.component';
import { DiaryListComponent } from './diary-list/diary-list.component';
import { DiaryRoutingModule } from './diary-routing.module';
import { MealTemplateModule } from '../meal-template/meal-template.module';
import { MacroResolve } from '../resolves/macro-resolve';
import { DiarySearchComponent } from './diary-search/diary-search.component';
import { MealTemplateResolve } from '../resolves/meal-template-resolve';
import { DiaryMetadataResolve } from '../resolves/diary-metadata-resolve';
import { DiarySidebarComponent } from './diary-list/diary-sidebar/diary-sidebar.component';
import { DiaryExpansionComponent } from './diary-list/diary-expansion/diary-expansion.component';
import { DiaryBodyComponent } from './diary-body/diary-body.component';
import { DiaryNameResolve } from '../resolves/diary-name-resolve';

@NgModule({
  declarations: [
    DiaryComponent,
    DiaryNavigationComponent,
    DiaryAdditionComponent,
    DiaryListComponent,
    DiarySearchComponent,
    DiarySidebarComponent,
    DiaryExpansionComponent,
    DiaryBodyComponent,
  ],
  imports: [
    CommonModule,
    DiaryRoutingModule,
    FormsModule,
    MaterialModule,
    ReactiveFormsModule,
    ValidationModule,
    DirectivesModule,
    MealTemplateModule
  ],
  providers: [
    DelayResolve,
    MacroResolve,
    MealTemplateResolve,
    DiaryMetadataResolve,
    DiaryNameResolve
  ]
})
export class DiaryModule { }
