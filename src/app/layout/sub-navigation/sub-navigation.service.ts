import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SubNavigationService {

  constructor() { }

  activeLinkSubject = new BehaviorSubject<string>('profile');
  activeLink = this.activeLinkSubject.asObservable();

  changeActiveLinkSubject = (value: string) => this.activeLinkSubject.next(value);

}
