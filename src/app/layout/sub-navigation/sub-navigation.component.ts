import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { subpageInitAnimation } from 'src/app/utility/subpage-animations';

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
  @ViewChild('subNavRef', { static: true }) subNavRef: ElementRef;
  @ViewChild('linkRef', { static: true }) linkRef: ElementRef;

  constructor(private router: Router) {
  }

  ngOnInit(): void {
    subpageInitAnimation(this.subNavRef.nativeElement, 0, 1.5, 0)
    subpageInitAnimation(this.linkRef.nativeElement, 0, 3.5, -15)

    this.router.events.pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.activeLink = event.url.split('/')[1]
      });


  }
}
