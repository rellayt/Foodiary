import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { startAnimation } from '../utility/basic-animations';

@Component({
  selector: 'app-meal-template',
  templateUrl: './meal-template.component.html',
  styleUrls: ['./meal-template.component.scss']
})
export class MealTemplateComponent implements OnInit {
  @ViewChild('mealTemplate', { static: true }) mealTemplate: ElementRef;

  constructor() { }

  ngOnInit(): void {
    startAnimation(this.mealTemplate.nativeElement, 0.7)
  }

}
