import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { BodyDimensions } from '../models/bodyDimensions.model';
import { BodyDimensionsService } from '../services/body-dimensions.service';

@Injectable()
export class BodyDimensionsResolve implements Resolve<BodyDimensions> {

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.bodyDimensionsService.getLatestBodyDimensions()
  }

  constructor(private bodyDimensionsService: BodyDimensionsService) { }

}
