import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { ProfileService } from '../profile.service';

@Component({
  selector: 'app-about-me',
  templateUrl: './about-me.component.html',
  styleUrls: ['./about-me.component.scss']
})
export class AboutMeComponent implements OnInit {

  profile$ = this.profileService.getUserProfile()

  constructor(private profileService: ProfileService, private router: Router) {
  }

  ngOnInit(): void { }

}
