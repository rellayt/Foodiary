import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router, RoutesRecognized } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { previousPage } from 'src/app/app.component';
import { endAnimation, startAnimation } from 'src/app/utility/basic-animations';

@Component({
  selector: 'app-meal-template-addition',
  templateUrl: './meal-template-addition.component.html',
  styleUrls: ['./meal-template-addition.component.scss']
})
export class MealTemplateAdditionComponent implements OnInit, OnDestroy {
  @ViewChild('templateAddition', { static: true }) templateAddition: ElementRef

  constructor(private router: Router) { }
  routerEvent: Subscription

  ngOnInit(): void {

    const value = previousPage === "/template/list" ? -20 : 0
    startAnimation(this.templateAddition.nativeElement, 0.35, value)

    this.routerEvent = this.router.events
      .pipe(filter(event => event instanceof RoutesRecognized))
      .subscribe((event: any) => {
        const nextPage = event.url
        const value = nextPage.split('/')[1] !== 'template' ? 0 : -20

        endAnimation(this.templateAddition.nativeElement, 0.35, value)
      })
  }
  scrollDown(e) {
    setTimeout(() => {
      this.templateAddition.nativeElement.scrollTo({ left: 0, top: this.templateAddition.nativeElement.scrollHeight, behavior: 'smooth' }), 205
    }, 5)
  }
  ngOnDestroy() { this.routerEvent.unsubscribe() }
}
