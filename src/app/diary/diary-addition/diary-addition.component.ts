import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router, RoutesRecognized, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';
import { previousPage } from 'src/app/app.component';
import { endAnimation, startAnimation } from 'src/app/utility/basic-animations';
import { DiaryService } from '../../services/diary.service';


@Component({
  selector: 'app-diary-addition',
  templateUrl: './diary-addition.component.html',
  styleUrls: ['./diary-addition.component.scss']
})
export class DiaryAdditionComponent implements OnInit {
  @ViewChild('diaryAddition', { static: true }) diaryAddition: ElementRef

  routerEvent: Subscription

  diaryName$ = this.route.data.pipe(
    map(({ diaryName: { diaryName } }) => diaryName),
  )

  ngOnInit(): void {
    const value = previousPage === "/diary/list" ? -20 : 0
    startAnimation(this.diaryAddition.nativeElement, 0.35, value)

    this.routerEvent = this.router.events
      .pipe(filter(event => event instanceof RoutesRecognized))
      .subscribe((event: any) => {
        const nextPage = event.url
        const value = nextPage.split('/')[1] !== 'diary' ? 0 : -20

        endAnimation(this.diaryAddition.nativeElement, 0.35, value)
      })
  }

  constructor(private router: Router, private route: ActivatedRoute, private diaryService: DiaryService) { }

  getDiaryName() {
    this.diaryName$ = this.diaryService.getDiaryName().pipe(map(({ diaryName }) => diaryName))
  }

}
