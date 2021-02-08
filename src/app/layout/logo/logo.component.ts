import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { logoStrokeDash, logoStrokeOpacity } from 'src/app/utility/navbar-gsap-animations';

@Component({
  selector: 'app-logo',
  templateUrl: './logo.component.html',
  styleUrls: ['./logo.component.scss']
})

export class LogoComponent implements OnInit {
  @ViewChild('foodiary', { static: true }) foodiary: ElementRef<HTMLDivElement>;

  constructor(private auth: AuthService) { }

  get isAuthenticated() { return this.auth.isAuthenticated }

  ngOnInit(): void {
    logoStrokeDash(this.foodiary.nativeElement)
    logoStrokeOpacity(this.foodiary.nativeElement, this.isAuthenticated)
  }
}
