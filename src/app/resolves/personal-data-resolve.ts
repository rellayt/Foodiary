import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { PersonalData } from "../models/personalData.model";
import { PersonalDataService } from '../services/personal-data.service';
import { AuthService } from '../auth/auth.service';
import { EMPTY } from "rxjs";
import { Injectable } from "@angular/core";

@Injectable()
export class PersonalDataResolve implements Resolve<PersonalData> {

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const personalDataId = this.authService.getCurrentUser().personalData

    return !personalDataId ? EMPTY : this.personalDataService.get(personalDataId)
  }

  constructor(private personalDataService: PersonalDataService, private authService: AuthService) { }
}
