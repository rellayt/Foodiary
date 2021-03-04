import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router, RoutesRecognized } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { previousPage } from 'src/app/app.component';
import { endAnimation, startAnimation } from 'src/app/utility/basic-animations';

@Component({
  selector: 'app-meal-template-list',
  templateUrl: './meal-template-list.component.html',
  styleUrls: ['./meal-template-list.component.scss']
})
export class MealTemplateListComponent implements OnInit, OnDestroy {
  @ViewChild('templateList', { static: true }) templateList: ElementRef;
  routerEvent: Subscription

  constructor(private router: Router) { }

  ngOnInit(): void {
    const value = previousPage === "/template/addition" ? 20 : 0
    startAnimation(this.templateList.nativeElement, 0.35, value)

    this.routerEvent = this.router.events
      .pipe(filter(event => event instanceof RoutesRecognized))
      .subscribe((event: any) => {
        const nextPage = event.url
        if (!nextPage.includes('?')) {
          const value = nextPage.split('/')[1] !== 'template' ? 0 : 20
          endAnimation(this.templateList.nativeElement, 0.35, value)
        }
      });
  }
  ngOnDestroy() {
    this.routerEvent.unsubscribe()
  }
}
