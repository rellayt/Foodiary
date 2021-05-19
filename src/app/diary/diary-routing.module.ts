import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthorizedGuard } from '../auth/authorized.guard';
import { DiaryComponent } from './diary.component';
import { DiaryListComponent } from './diary-list/diary-list.component';
import { DelayResolve } from '../resolves/delay-resolve';
import { DiaryAdditionComponent } from './diary-addition/diary-addition.component';
import { CommonModule } from '@angular/common';
import { MacroResolve } from '../resolves/macro-resolve';
import { MealTemplateResolve } from '../resolves/meal-template-resolve';
import { DiaryMetadataResolve } from '../resolves/diary-metadata-resolve';
import { DiaryNameResolve } from '../resolves/diary-name-resolve';

const routes: Routes = [
  {
    path: 'diary',
    redirectTo: 'diary/list',
    pathMatch: 'full'
  },
  {
    path: 'diary',
    component: DiaryComponent,
    canActivate: [
      AuthorizedGuard
    ], children: [
      {
        path: 'list',
        component: DiaryListComponent,
        resolve: {
          'delay': DelayResolve,
          'userMacro': MacroResolve,
          'diaryMetadata': DiaryMetadataResolve,
          'mealTemplates': MealTemplateResolve
        }
      },
      {
        path: 'addition',
        component: DiaryAdditionComponent,
        resolve: {
          'delay': DelayResolve,
          'userMacro': MacroResolve,
          'mealTemplates': MealTemplateResolve,
          'diaryName': DiaryNameResolve
        }
      }
    ]
  },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class DiaryRoutingModule { }
