import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { subpageInitAnimation } from '../utility/subpage-animations';

@Component({
  selector: 'app-product',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  @ViewChild('productsCardRef', { static: true }) productsCardRef: ElementRef;

  constructor() { }

  ngOnInit(): void {
    subpageInitAnimation(this.productsCardRef.nativeElement, 0, 0.7, 0)

  }

}
