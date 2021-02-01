import { Component, OnInit, Renderer2 } from '@angular/core';
import { ElementRef, ViewChild } from '@angular/core';
import { guestNavAnimation, initLogoAnimation } from 'src/app/utility/navbar-gsap-animations';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-guest-navbar',
  templateUrl: './guest-navbar.component.html',
  styleUrls: ['./guest-navbar.component.scss']
})
export class GuestNavbarComponent implements OnInit {
  @ViewChild('title', { static: true }) title: ElementRef;
  @ViewChild('menuItem1', { static: true }) menuItem1: ElementRef;
  @ViewChild('menuItem2', { static: true }) menuItem2: ElementRef;
  @ViewChild('menuItem3', { static: true }) menuItem3: ElementRef;
  @ViewChild('menuItem4', { static: true }) menuItem4: ElementRef;

  constructor(private renderer: Renderer2) { }

  ngOnInit(): void {
    const menuItems = [this.menuItem1, this.menuItem2, this.menuItem3, this.menuItem4].map(el => el.nativeElement);
    this.initialAnimations(menuItems)
    this.menuItemsHover(menuItems)
  }

  initialAnimations = (menuItems) => {
    initLogoAnimation(this.title.nativeElement);
    let value = 1;
    menuItems.forEach((elementRef) => {
      guestNavAnimation(elementRef, value);
      value += 0.3;
    });
  }

  menuItemsHover = (menuItems) => {
    menuItems.forEach((hoverElement) => {
      const secondaryElements = Object.assign([], menuItems).filter((el) => el !== hoverElement)
      secondaryElements.forEach((sideElement: ElementRef) => {
        hoverElement.addEventListener('mouseenter', () => this.renderer.addClass(sideElement, 'element-hover'))
        hoverElement.addEventListener('mouseleave', () => this.renderer.removeClass(sideElement, 'element-hover'))
      })
    })
  }
}
