import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-products-navigation',
  templateUrl: './products-navigation.component.html',
  styleUrls: ['./products-navigation.component.scss']
})
export class ProductsNavigationComponent implements OnInit {

  pages = [{ label: 'Lista', link: 'list' },
  { label: 'Dodaj produkty', link: 'addition' }];

  activeLink;

  constructor(private router: Router) {
  }

  ngOnInit(): void {
    this.activeLink = this.router.url.split('/')[2].charAt(0) === 'l' ? 'list' : 'addition'
  }

}
