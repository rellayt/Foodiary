import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MealTemplate } from '../models/mealTemplate.model';

@Injectable({
  providedIn: 'root'
})
export class MealTemplateService {

  constructor(private http: HttpClient) { }

  save(data: MealTemplate) {
    return this.http.post<MealTemplate>(`${environment.API_URL}/meal_templates`, data)
  }

  update(data: MealTemplate, id: string) {
    return this.http.put<MealTemplate>(`${environment.API_URL}/meal_templates/${id}`, data)
  }

  getMany(query?: string) {
    return this.http.get<MealTemplate[]>(`${environment.API_URL}/meal_templates/`, {
      params: {
        q: query || ''
      }
    })
  }

  delete(id: string) {
    return this.http.delete<MealTemplate>(`${environment.API_URL}/meal_templates/${id}`)
  }

}

