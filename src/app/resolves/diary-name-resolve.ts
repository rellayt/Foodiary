import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { DiaryService } from '../services/diary.service';

@Injectable()
export class DiaryNameResolve implements Resolve<string> {

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.diaryService.getDiaryName()
  }

  constructor(private diaryService: DiaryService) { }
}
