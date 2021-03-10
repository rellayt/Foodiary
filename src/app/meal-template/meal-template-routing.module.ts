import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthorizedGuard } from '../auth/authorized.guard';
import { DelayResolve } from '../resolves/delay-resolve';
import { MealTemplateComponent } from './meal-template.component';
import { MealTemplateListComponent } from './meal-template-list/meal-template-list.component';
import { MealTemplateAdditionComponent } from './meal-template-addition/meal-template-addition.component';
import { CommonModule } from '@angular/common';
import { MealTemplateResolve } from '../resolves/meal-template-resolve';


const routes: Routes = [
  {
    path: 'template',
    redirectTo: 'template/list',
  },
  {
    path: 'template',
    component: MealTemplateComponent,
    canActivate: [
      AuthorizedGuard
    ], children: [
      {
        path: 'list',
        component: MealTemplateListComponent,
        resolve: {
          'delay': DelayResolve,
          'mealTemplate': MealTemplateResolve
        }
      },
      {
        path: 'addition',
        component: MealTemplateAdditionComponent,
        resolve: {
          'delay': DelayResolve,
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
export class MealTemplateRoutingModule { }
