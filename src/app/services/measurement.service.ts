import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Measurement } from '../models/measurement.model';
import { Observable } from 'rxjs';
import { shareReplay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MeasurementService {

  constructor(private http: HttpClient) { }

  private latestMeasurement_request: Observable<Measurement>

  getLatestMeasurement() {
    if (!this.latestMeasurement_request) {
      this.latestMeasurement_request = this.http
        .get<Measurement>(`${environment.API_URL}/measurement/latest`)
        .pipe(shareReplay())
    }
    return this.latestMeasurement_request
  }

  save(measurement: Measurement) {
    return this.http.post<Measurement>(`${environment.API_URL}/measurement`, measurement)
  }

  clearCache() {
    this.latestMeasurement_request = null
  }
}
