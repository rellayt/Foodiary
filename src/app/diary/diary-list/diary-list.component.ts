import { Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { Router, RoutesRecognized, ActivatedRoute } from '@angular/router';
import { Subscription, of } from 'rxjs';
import { filter, first, map, switchMap, tap } from 'rxjs/operators';
import { previousPage } from 'src/app/app.component';
import { endAnimation, fromToOpacityAnimation, startAnimation } from 'src/app/utility/basic-animations';
import { DiaryService } from '../../services/diary.service';
import { Diary } from '../../models/diary.model';
import { SnackBarService } from '../../services/snack-bar.service';
import { MatDialog } from '@angular/material/dialog';
import { DeleteDialogComponent } from 'src/app/layout/dialogs/delete/delete-dialog.component';

@Component({
  selector: 'app-diary-list',
  templateUrl: './diary-list.component.html',
  styleUrls: ['./diary-list.component.scss']
})
export class DiaryListComponent implements OnInit {
  @ViewChild('listContainer', { static: true }) listContainer: ElementRef;
  @ViewChildren('metadatas') metadatas: QueryList<ElementRef>
  @ViewChild('sidebar', { static: true }) sidebar: ElementRef;
  @ViewChild('expansion', { static: true }) expansion: ElementRef;
  @ViewChild('diaryEdit', { static: true }) diaryEdit: ElementRef;

  state = 'list'
  routerEvent: Subscription
  diaryMetadata$ = this.route.data.pipe(
    filter(({ diaryMetadata }) => diaryMetadata.length > 0),
    tap(({ diaryMetadata }) => this.diaryMetadatas = diaryMetadata),
    map(({ diaryMetadata }) => this.modifyMetadata(diaryMetadata)),
  )
  userMacro$ = this.route.data.pipe(map(({ userMacro }) => userMacro))
  selectedDiary: Diary = null
  sidebarData = []
  diaryMetadatas;

  constructor(private router: Router, private route: ActivatedRoute, private diaryService: DiaryService,
    private snackBar: SnackBarService, private dialog: MatDialog) { }

  ngOnInit(): void {
    const value = previousPage === "/diary/addition" ? 20 : 0
    startAnimation(this.listContainer.nativeElement, 0.35, value)

    this.routerEvent = this.router.events
      .pipe(filter(event => event instanceof RoutesRecognized))
      .subscribe((event: any) => {
        const nextPage = event.url
        if (!nextPage.includes('?')) {
          const value = nextPage.split('/')[1] !== 'diary' ? 0 : 20
          endAnimation(this.listContainer.nativeElement, 0.35, value)
        }
      });
  }

  modifyMetadata(diaryMetadata) {
    return diaryMetadata.map(diary => {
      let names = 'Nazwy posiłków:\t\n'
      diary.templateNames.forEach(name => names += `• ${name}\n`)
      return {
        ...diary,
        names
      }
    })
  }

  selectDiary(index: number, diaryId: string) {
    const selectedDiaryRef = this.metadatas.toArray()[index].nativeElement
    const diariesRef = this.metadatas.toArray().filter((diary, i) => i !== index)

    this.diaryService.getDiary(diaryId)
      .pipe(first())
      .subscribe(res => this.selectedDiary = res)

    this.sidebarData = this.diaryMetadatas
      .map(({ name, _id }) => ({ name, _id }))
      .filter(({ name }) => name !== this.diaryMetadatas[index].name)

    setTimeout(() => {
      for (let diary of diariesRef) endAnimation(diary.nativeElement, 0.4, -40, 0, 0.95)
    }, 100)
    setTimeout(() => endAnimation(selectedDiaryRef, 0.4), 250)
    setTimeout(() => {
      this.state = 'view'
      fromToOpacityAnimation(this.expansion.nativeElement, 0.45, 0, -10)
      fromToOpacityAnimation(this.sidebar.nativeElement, 0.45, 20)
      this.listContainer.nativeElement.scrollTo({ left: 0, top: 0, behavior: 'smooth' })
    }, 455)
  }

  sidebarSelection(diary) {
    endAnimation(this.expansion.nativeElement, 0.25)
    endAnimation(this.sidebar.nativeElement, 0.25, -10)
    const { _id, name } = diary

    setTimeout(() => {
      this.diaryService.getDiary(_id)
        .pipe(first())
        .subscribe(res => this.selectedDiary = res)

      this.sidebarData = this.diaryMetadatas
        .map(({ name, _id }) => ({ name, _id }))
        .filter((data) => data.name !== name)
      fromToOpacityAnimation(this.expansion.nativeElement, 0.25, 0, -10)
      fromToOpacityAnimation(this.sidebar.nativeElement, 0.25, -10)
      this.listContainer.nativeElement.scrollTo({ left: 0, top: 0, behavior: 'smooth' })
    }, 250)
  }

  backToList(from) {
    from === 'view' ? this.endDiaryView() : endAnimation(this.diaryEdit.nativeElement, 0.4)

    setTimeout(() => {
      this.state = 'list'
      for (let diary of this.metadatas.toArray()) fromToOpacityAnimation(diary.nativeElement, 1.4)
      this.selectedDiary = null
    }, 400)
  }

  backToDiaryView(updated) {
    endAnimation(this.diaryEdit.nativeElement, 0.4)

    if (updated) {
      this.diaryService.getDiary(this.selectedDiary._id)
        .pipe(first())
        .subscribe(res => this.selectedDiary = res)

      this.sidebarData = this.diaryMetadatas
        .map(({ name, _id }) => ({ name, _id }))
        .filter(({ name }) => name !== this.selectedDiary.name)
    }

    setTimeout(() => {
      this.state = 'view'
      fromToOpacityAnimation(this.expansion.nativeElement, 0.25, 0, -10)
      fromToOpacityAnimation(this.sidebar.nativeElement, 0.25, -10)
    }, 400);
  }

  goToEdit() {
    this.endDiaryView()
    setTimeout(() => {
      this.state = 'edit'
      fromToOpacityAnimation(this.diaryEdit.nativeElement, 0.4)
    }, 350)
  }

  deleteDiary(buttonRef) {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      data: {
        name: this.selectedDiary.name,
        type: ''
      },
      disableClose: true,
      autoFocus: false
    })
    dialogRef.afterClosed().pipe(
      tap(() => buttonRef._elementRef.nativeElement.blur()),
      filter(Boolean),
      switchMap(() => this.diaryService.delete(this.selectedDiary._id))
    ).subscribe(res => {
      this.diaryMetadata$ = this.diaryService.getDiaryMetadata().pipe(
        filter((diaryMetadata: any) => diaryMetadata.length > 0),
        tap(diaryMetadata => this.diaryMetadatas = diaryMetadata),
        map(diaryMetadata => this.modifyMetadata(diaryMetadata)),
      )
      this.endDiaryView()
      this.snackBar.open('Dziennik został usunięty', 1500, true)
      setTimeout(() => {
        this.state = 'list'
        for (let diary of this.metadatas.toArray()) fromToOpacityAnimation(diary.nativeElement, 0.4)
      }, 300);
    })
  }
  endDiaryView = () => {
    endAnimation(this.expansion.nativeElement, 0.4)
    endAnimation(this.sidebar.nativeElement, 0.4)
  }
  updateUserMacro(userMacro) {
    this.selectedDiary = { ...this.selectedDiary }
    this.userMacro$ = of(({ ...userMacro }))
  }
}
