import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Diary, DiaryMetadata } from '../models/diary.model';
import { DiaryService } from '../services/diary.service';

@Injectable()
export class DiaryMetadataResolve implements Resolve<DiaryMetadata> {

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.diaryService.getDiaryMetadata()
  }

  constructor(private diaryService: DiaryService) { }
}
