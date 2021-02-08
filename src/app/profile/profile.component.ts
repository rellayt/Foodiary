import { Component, OnInit } from '@angular/core';
import { User } from '../models/user.model';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  constructor(private router: Router) {
  }

  ngOnInit(): void {

    this.router.events.pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        console.log(event);
        console.log(event.url.split('/')[2]);
      });
  }
}
