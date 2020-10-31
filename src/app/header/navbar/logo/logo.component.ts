import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { gsap } from 'gsap';

@Component({
  selector: 'app-logo',
  templateUrl: './logo.component.html',
  styleUrls: ['./logo.component.scss']
})

export class LogoComponent implements OnInit {
  @ViewChild('foodiary', { static: true }) foodiary: ElementRef<HTMLDivElement>;
  constructor() { }

  ngOnInit(): void {
    this.initialAnimations();
  }
  initialAnimations = () => {
    gsap.from(this.foodiary.nativeElement, {
      duration: 3,
      delay: 1,
      strokeLinecap: 0,
      strokeDasharray: 5000,
      strokeDashoffset: 5000,
      fill: 'none',
    });
    gsap.to(this.foodiary.nativeElement, {
      duration: 1,
      opacity: 0.90,
      delay: 3,
      fill: 'black',
      strokeOpacity: 0.2
    });
  }
}
