import { createTemplateSummary } from './../../utility/meal-template-calculations';
import { Component, ElementRef, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router, RoutesRecognized } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter, first, map, switchMap, tap } from 'rxjs/operators';
import { previousPage } from 'src/app/app.component';
import { MealTemplate } from 'src/app/models/mealTemplate.model';
import { endAnimation, startAnimation } from 'src/app/utility/basic-animations';
import { getCalory } from '../../utility/macro-calculations';
import { fromToOpacityAnimation } from '../../utility/basic-animations';
import { DeleteDialogComponent } from 'src/app/layout/dialogs/delete/delete-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { SnackBarService } from 'src/app/services/snack-bar.service';
import { MealTemplateService } from '../../services/mealTemplate.service';
import { deepCopy } from 'src/app/utility/utility';

@Component({
  selector: 'app-meal-template-list',
  templateUrl: './meal-template-list.component.html',
  styleUrls: ['./meal-template-list.component.scss']
})
export class MealTemplateListComponent implements OnInit, OnDestroy {
  @ViewChild('listContainer', { static: true }) listContainer: ElementRef;
  @ViewChild('mealTemplateEdit', { static: true }) mealTemplateEdit: ElementRef;
  @ViewChild('mealTemplateList', { static: true }) mealTemplateList: ElementRef;
  @ViewChildren('groups') groups: QueryList<ElementRef>

  routerEvent: Subscription

  constructor(private router: Router, private route: ActivatedRoute, private dialog: MatDialog,
    private snackBar: SnackBarService, private mealTemplateService: MealTemplateService) { }

  selectedMealTemplate = null

  mealTemplate$ = this.route.data.pipe(
    map(data => data.mealTemplate),
    filter(mealTemplate => mealTemplate.length > 0),
    map(mealTemplates => createTemplateSummary(mealTemplates)),
    first(),
  )

  ngOnInit(): void {
    const value = previousPage === "/template/addition" ? 20 : 0
    startAnimation(this.listContainer.nativeElement, 0.35, value)

    this.routerEvent = this.router.events
      .pipe(filter(event => event instanceof RoutesRecognized))
      .subscribe((event: any) => {
        const nextPage = event.url
        if (!nextPage.includes('?')) {
          const value = nextPage.split('/')[1] !== 'template' ? 0 : 20
          endAnimation(this.listContainer.nativeElement, 0.35, value)
        }
      });
  }


  scrollDown(e) {
    setTimeout(() => {
      this.listContainer.nativeElement.scrollTo({ left: 0, top: this.listContainer.nativeElement.scrollHeight, behavior: 'smooth' }), 205
    }, 5)
  }

  selectMealTemplate(mealTemplate) {
    endAnimation(this.mealTemplateList.nativeElement, 0.4)
    setTimeout(() => {
      this.selectedMealTemplate = deepCopy(mealTemplate)
      fromToOpacityAnimation(this.mealTemplateEdit.nativeElement, 0.4)
    }, 400)
  }

  backToList(e) {
    endAnimation(this.mealTemplateEdit.nativeElement, 0.4)
    setTimeout(() => {
      if (e) {
        this.mealTemplate$ = this.mealTemplateService.getMany().pipe(
          filter(mealTemplate => mealTemplate !== null),
          map(mealTemplates => createTemplateSummary(mealTemplates)),
          first(),
        )
      }
      this.selectedMealTemplate = null
      fromToOpacityAnimation(this.mealTemplateList.nativeElement, 0.4)
    }, 400)
  }

  delete(mealTemplate: MealTemplate, buttonRef: any, index: number) {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      data: {
        name: mealTemplate.name,
        type: 'szablon'
      },
      disableClose: true,
      autoFocus: false
    })
    dialogRef.afterClosed().pipe(
      tap(() => buttonRef._elementRef.nativeElement.blur()),
      filter(Boolean),
      switchMap(() => this.mealTemplateService.delete(mealTemplate.id))
    ).subscribe(res => {
      endAnimation(this.groups.toArray()[index].nativeElement, 0.45)
      setTimeout(() =>
        this.mealTemplate$ = this.mealTemplateService.getMany().pipe(
          filter(mealTemplate => mealTemplate !== null),
          map(mealTemplates => createTemplateSummary(mealTemplates)),
          first(),
        ), 450)

      this.snackBar.open('Szablon został usunięty', 1500, true)
    })
  }

  ngOnDestroy() {
    this.routerEvent.unsubscribe()
  }
}
