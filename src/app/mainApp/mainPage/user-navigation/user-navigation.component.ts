import { Component, OnInit } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-navigation',
  templateUrl: './user-navigation.component.html',
  styleUrls: ['./user-navigation.component.scss']
})
export class UserNavigationComponent implements OnInit {

  pages = [{ id: 'Profil', link: 'profile' },
  { id: 'Dziennik', link: 'diary' }, { id: 'Szablon', link: 'template' },
  { id: 'Produkty', link: 'products' }, { id: 'Dodaj przepis', link: 'add-recipe' }];
  background: ThemePalette = undefined;

  constructor(public router: Router) { }

  ngOnInit(): void {
  }
}
