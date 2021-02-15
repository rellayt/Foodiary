import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Macro } from '../models/macro.model';
import { environment } from 'src/environments/environment';
import { map, share, shareReplay } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MacroService {

  constructor(private http: HttpClient) { }

  private latestMacro_request: Observable<Macro>

  getMacro() {
    if (!this.latestMacro_request) {
      this.latestMacro_request = this.http.get<Macro>(`${environment.API_URL}/macro/latest`)
        .pipe(
          map(res => !res ? { calory: 0, protein: 0, carb: 0, fat: 0 } : res),
          shareReplay(),
        )
    }
    return this.latestMacro_request;
  }

  saveMacro(macro: Macro) {
    return this.http.post<Macro>(`${environment.API_URL}/macro/`, macro)
  }

  clearMacroCache() {
    this.latestMacro_request = null;
  }
}
