import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../models/user.model';
import { startAnimation } from '../utility/basic-animations';

@Component({
  selector: 'app-diary',
  templateUrl: './diary.component.html',
  styleUrls: ['./diary.component.scss']
})
export class DiaryComponent implements OnInit {
  @ViewChild('diary', { static: true }) diary: ElementRef;
  currentUser: User;

  constructor(private router: Router) { }

  ngOnInit(): void {
    startAnimation(this.diary.nativeElement, 0.7)
  }

}
