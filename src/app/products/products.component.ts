import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { startAnimation } from '../utility/basic-animations';

@Component({
  selector: 'app-product',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  @ViewChild('productsCard', { static: true }) productsCard: ElementRef;

  constructor() { }

  ngOnInit(): void {
    startAnimation(this.productsCard.nativeElement, 0.7)

  }

}
