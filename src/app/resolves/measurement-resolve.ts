import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { Measurement } from "../models/measurement.model";
import { MeasurementService } from '../services/measurement.service';

@Injectable()
export class MeasurementResolve implements Resolve<Measurement> {

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

    return this.measurementService.getLatestMeasurement()
  }
  constructor(private measurementService: MeasurementService) { }

}
