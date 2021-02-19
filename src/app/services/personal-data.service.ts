import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PersonalData } from '../models/personalData.model';
import { first, shareReplay, map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PersonalDataService {

  constructor(private http: HttpClient) { }

  private personalData_request: Observable<PersonalData>

  get(personalDataId: string) {
    if (!this.personalData_request) {
      this.personalData_request = this.http.get<PersonalData>(`${environment.API_URL}/user/personal_data`,
        {
          params: {
            id: personalDataId
          }
        }).pipe(shareReplay())
    }
    return this.personalData_request
  }

  save(data: PersonalData) {
    return this.http.post<PersonalData>(`${environment.API_URL}/user/personal_data`, data)
  }

  update(data: PersonalData, id: string) {
    return this.http.put<PersonalData>(`${environment.API_URL}/user/personal_data/${id}`, data)
  }

  clearCache() {
    this.personalData_request = null
  }

}
