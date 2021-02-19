import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { shareReplay } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { BodyDimensions } from '../models/bodyDimensions.model';

@Injectable({
  providedIn: 'root'
})
export class BodyDimensionsService {

  constructor(private http: HttpClient) { }

  private latestBodyDimensions_request: Observable<BodyDimensions>

  getLatestBodyDimensions() {
    if (!this.latestBodyDimensions_request) {
      this.latestBodyDimensions_request = this.http
        .get<BodyDimensions>(`${environment.API_URL}/body_dimensions/latest`)
        .pipe(shareReplay())
    }
    return this.latestBodyDimensions_request
  }

  save(bodyDimensions: BodyDimensions) {
    return this.http.post<BodyDimensions>(`${environment.API_URL}/body_dimensions`, bodyDimensions)
  }

  clearCache() {
    this.latestBodyDimensions_request = null
  }
}
