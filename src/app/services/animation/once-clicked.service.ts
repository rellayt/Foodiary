import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OnceClickedService {
  onceClickedSubject = new BehaviorSubject<boolean>(false);
  onceClicked = this.onceClickedSubject.asObservable();

  constructor() { }

  changeOnceClickedSubject = (value: boolean) => this.onceClickedSubject.next(value);

}
