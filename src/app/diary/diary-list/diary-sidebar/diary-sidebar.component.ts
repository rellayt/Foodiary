import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-diary-sidebar',
  templateUrl: './diary-sidebar.component.html',
  styleUrls: ['./diary-sidebar.component.scss']
})
export class DiarySidebarComponent {

  @Input() diaryNames = []
  @Output() selectedDiaryEmitter: EventEmitter<Object> = new EventEmitter()

  block = false;
  constructor() { }

  selectDiary(diary) {
    this.selectedDiaryEmitter.emit(diary)
    this.block = true;
    setTimeout(() => this.block = false, 750)
  }

}
