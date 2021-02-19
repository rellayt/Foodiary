import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile-navigation',
  templateUrl: './profile-navigation.component.html',
  styleUrls: ['./profile-navigation.component.scss']
})
export class ProfileNavigationComponent implements OnInit {

  pages = [{ label: 'O mnie', link: 'about_me' },
  { label: 'Aktualizacja profilu', link: 'edit' }, { label: 'Ustawienia', link: 'settings' }];

  activeLink;

  constructor(private router: Router) {
  }

  ngOnInit(): void {
    this.activeLink = this.router.url.split('/')[2]
  }

}
