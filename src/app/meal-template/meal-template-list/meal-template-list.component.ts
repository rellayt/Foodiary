import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router, RoutesRecognized } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { previousPage } from 'src/app/app.component';
import { MealTemplate } from 'src/app/models/mealTemplate.model';
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

  selectedMealTemplate = fake_data

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

  scrollDown(e) {
    setTimeout(() => {
      this.templateList.nativeElement.scrollTo({ left: 0, top: this.templateList.nativeElement.scrollHeight, behavior: 'smooth' }), 205
    }, 5)
  }
  ngOnDestroy() {
    this.routerEvent.unsubscribe()
  }
}
const fake_data: MealTemplate =
{
  name: "Obiadek",
  time: "13:45",
  products: [
    {
      calory: 0,
      quantity: 100,
      name: 'Pierogi',
      protein: 25,
      carb: 50,
      fat: 10
    },
    {
      calory: 0,
      quantity: 25,
      name: 'Truskawki',
      protein: 47,
      carb: 25,
      fat: 15
    },
    {
      calory: 0,
      quantity: 240,
      name: 'Banany',
      protein: 15,
      carb: 28,
      fat: 29
    },
  ]
}
