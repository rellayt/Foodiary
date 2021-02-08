import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-sub-navigation',
  templateUrl: './sub-navigation.component.html',
  styleUrls: ['./sub-navigation.component.scss']
})
export class SubNavigationComponent implements OnInit {

  pages = [{ label: 'Profil', link: 'profile' },
  { label: 'Dziennik', link: 'diary' }, { label: 'Szablony', link: 'template' },
  { label: 'Produkty', link: 'products' }, { label: 'Dodaj przepis', link: 'add-recipe' }];

  activeLink;

  constructor(private router: Router, private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.router.events.pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.activeLink = event.url.split('/')[1]
      });
  }
}
