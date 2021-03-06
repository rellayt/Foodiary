import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { startAnimation } from '../utility/basic-animations';

@Component({
  selector: 'app-product',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  @ViewChild('productsCardRef', { static: true }) productsCardRef: ElementRef;

  constructor() { }

  ngOnInit(): void {
    startAnimation(this.productsCardRef.nativeElement, 0.7)

  }

}
