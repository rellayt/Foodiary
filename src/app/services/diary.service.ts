import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Diary, DiaryMetadata } from '../models/diary.model';

@Injectable({
  providedIn: 'root'
})
export class DiaryService {

  constructor(private http: HttpClient) { }

  save(data: Diary) {
    return this.http.post<Diary>(`${environment.API_URL}/diary`, data)
  }

  update(data: Diary, id: string) {
    return this.http.put<Diary>(`${environment.API_URL}/diary/${id}`, data)
  }

  // update(data: MealTemplate, id: string) {
  //   return this.http.put<MealTemplate>(`${environment.API_URL}/meal_templates/${id}`, data)
  // }

  // getDiaries(info?: Boolean) {
  //   const params = info ?  : {}
  //   return this.http.get<Diary>(`${environment.API_URL}/diary`, {
  //     params
  //   })
  // }

  delete(id: string) {
    return this.http.delete<Diary>(`${environment.API_URL}/diary/${id}`)
  }

  getDiaryName() {
    const params = { name: 'true' }
    return this.http.get<any>(`${environment.API_URL}/diary`, { params })
  }

  getDiaryMetadata() {
    const params = { metadata: 'true' }
    return this.http.get<DiaryMetadata>(`${environment.API_URL}/diary`, { params })
  }

  getDiary(id) {
    return this.http.get<Diary>(`${environment.API_URL}/diary/${id}`)
  }

}
