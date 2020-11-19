import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SubNavigationService } from '../../../services/sub-navigation/sub-navigation.service';

@Component({
  selector: 'app-sub-navigation',
  templateUrl: './sub-navigation.component.html',
  styleUrls: ['./sub-navigation.component.scss']
})
export class SubNavigationComponent implements OnInit {

  pages = [{ id: 'Profil', link: 'profile' },
  { id: 'Dziennik', link: 'diary' }, { id: 'Szablony', link: 'template' },
  { id: 'Produkty', link: 'products' }, { id: 'Dodaj przepis', link: 'add-recipe' }];

  activeLink;

  constructor(private router: Router, private subNavigationService: SubNavigationService) { }

  ngOnInit(): void {
    this.subNavigationService.activeLink.subscribe(activeLink => this.activeLink = activeLink);
  }
}
