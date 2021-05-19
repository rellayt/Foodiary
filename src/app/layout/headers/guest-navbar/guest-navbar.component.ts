import { Component, EventEmitter, OnInit, Output, Renderer2 } from '@angular/core';
import { ElementRef, ViewChild } from '@angular/core';
import { guestNavAnimation, initLogoAnimation } from 'src/app/utility/navbar-gsap-animations';
import { startAnimation } from '../../../utility/basic-animations';

@Component({
  selector: 'app-guest-navbar',
  templateUrl: './guest-navbar.component.html',
  styleUrls: ['./guest-navbar.component.scss']
})
export class GuestNavbarComponent implements OnInit {
  @ViewChild('header', { static: true }) header: ElementRef
  @ViewChild('logo', { static: true }) logo: ElementRef
  @ViewChild('menu', { static: true }) menu: ElementRef
  @ViewChild('account', { static: true }) account: ElementRef

  @Output() navigateEmitter: EventEmitter<string> = new EventEmitter()

  constructor() { }

  ngOnInit(): void {
    initLogoAnimation(this.logo.nativeElement)
    startAnimation(this.header.nativeElement, 1.2, 0, -30)
    let delay = 0.4
    this.menu.nativeElement.childNodes.forEach(node => {
      startAnimation(node, 0.9, 0, -20, delay)
      delay += 0.2
    })
    startAnimation(this.account.nativeElement, 2, 0, 0, 1.3)
  }

  navigate(url) {
    this.navigateEmitter.emit(url)
  }

}
