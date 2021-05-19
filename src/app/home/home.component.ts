import { Component, OnInit, ViewChild } from '@angular/core';
import { ElementRef } from '@angular/core';
import { gsap } from 'gsap';
import { Router } from '@angular/router';
import { startAnimation, endAnimation } from '../utility/basic-animations';
import { browserRefresh } from '../app.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  @ViewChild('heading', { static: true }) heading: ElementRef
  @ViewChild('info', { static: true }) info: ElementRef
  @ViewChild('begin', { static: true }) begin: ElementRef

  constructor(private router: Router) { }

  ngOnInit(): void {
    const delay = browserRefresh ? 0.7 : 0.2
    this.heading.nativeElement.childNodes.forEach((node, i) => startAnimation(node, 1.1, 0, -20, delay))
    startAnimation(this.info.nativeElement, 1.1, 0, -20, delay)
    startAnimation(this.begin.nativeElement, 1.1, 0, -20, delay)
  }

  navigate(url) {
    this.endAnimation()
    setTimeout(() => this.router.navigate([url]), 400)
  }

  endAnimation() {
    this.heading.nativeElement.childNodes.forEach(node => endAnimation(node, 0.4))
    endAnimation(this.info.nativeElement, 0.4)
    endAnimation(this.begin.nativeElement, 0.4)
  }
}
