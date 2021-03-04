import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-meal-template-navigation',
  templateUrl: './meal-template-navigation.component.html',
  styleUrls: ['./meal-template-navigation.component.scss']
})
export class MealTemplateNavigationComponent implements OnInit {

  pages = [{ label: 'Lista', link: 'list' },
  { label: 'Dodaj szablon', link: 'addition' }]

  activeLink

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.activeLink = this.router.url.split('/')[2]
  }

}
