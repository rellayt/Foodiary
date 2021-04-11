import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { MealTemplateService } from '../services/mealTemplate.service';
import { MealTemplate } from '../models/mealTemplate.model';

@Injectable()
export class MealTemplateResolve implements Resolve<MealTemplate[]> {

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.mealTemplateService.getMany()
  }

  constructor(private mealTemplateService: MealTemplateService) { }
}
