import { Component, ElementRef, EventEmitter, Input, OnInit, Output, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { SnackBarService } from 'src/app/services/snack-bar.service';
import { MealTemplateService } from 'src/app/services/mealTemplate.service';
import { DiaryService } from '../../services/diary.service';
import { MatDialog } from '@angular/material/dialog';
import { MealTemplateBodyComponent } from 'src/app/meal-template/meal-template-body/meal-template-body.component';
import { getCalory } from '../../utility/macro-calculations';
import { CaloryHelpDialogComponent } from '../../profile/profile-editor/calory-form/calory-help-dialog/calory-help-dialog.component';
import { Macro } from 'src/app/models/macro.model';
import { deepCopy } from '../../utility/utility';
import { HttpErrorResponse } from '@angular/common/http';
import { clearProduct } from '../../helpers/meal-template';
import { ActivatedRoute } from '@angular/router';
import { iif, of, timer } from 'rxjs';
import { filter, finalize, first, map, mergeMap, tap } from 'rxjs/operators';
import { counterAnimation, endAnimation, fromToOpacityAnimation, startAnimation } from 'src/app/utility/basic-animations';

@Component({
  selector: 'app-diary-body',
  templateUrl: './diary-body.component.html',
  styleUrls: ['./diary-body.component.scss']
})
export class DiaryBodyComponent implements OnInit {
  @ViewChildren('templates') templates: QueryList<ElementRef>
  @ViewChildren('templateBody') mealTemplatesCmp: QueryList<MealTemplateBodyComponent>

  objectValues = Object.values
  buttonState = {
    save: {
      disabled: true,
      message: 'Dziennik: '
    },
    nextTemplate: {
      disabled: true,
      message: 'Dziennik: '
    },
    search: {
      disabled: false
    }
  }
  @Input() editMode = false
  @Output() backEmitter: EventEmitter<Boolean> = new EventEmitter()
  @Output() listEmitter: EventEmitter<string> = new EventEmitter()
  @Output() updateEmitter: EventEmitter<Boolean> = new EventEmitter()
  @Output() userMacroEmitter: EventEmitter<Object> = new EventEmitter()
  @Output() diaryNameEmitter: EventEmitter<Boolean> = new EventEmitter()

  userMacro$ = this.route.data.pipe(
    map(({ userMacro }) => userMacro),
    map(userMacro => userMacro ? ({ ...userMacro, calory: getCalory(userMacro) }) :
      { protein: 0, carb: 0, fat: 0, calory: 0 }),
    tap(macro =>
      this.summary = ({
        delivered: { calory: 0, protein: 0, carb: 0, fat: 0 },
        remain: ({ ...macro }),
        nutriments: ({ ...macro }),
      })),
    first(),
  )
  mealTemplates$ = this.route.data.pipe(
    map(data => data.mealTemplates.length > 0),
    first(),
  )
  diaryInitialState = {
    _id: '',
    name: '',
    mealTemplates: [
      {
        name: undefined,
        time: '00:00',
        products: [],
        id: undefined
      }
    ]
  }
  diary = deepCopy(this.diaryInitialState)
  @Input() set diaryName(name) {
    this.diary.name = name
  }
  @Input() set diaryData(data) {
    this.diary = deepCopy(data)
  }
  summary

  addMealTemplate(mealTemplate = { name: '', time: '00:00', products: [], id: undefined }) {
    this.diary.mealTemplates.push(mealTemplate)
    this.solveState()

    setTimeout(() => {
      fromToOpacityAnimation(this.templates.toArray()[this.diary.mealTemplates.length - 1].nativeElement, 2)
    }, 150)
  }

  removeMealTemplate(index) {
    endAnimation(this.templates.toArray()[index].nativeElement, 0.35)
    setTimeout(() => {
      this.diary.mealTemplates.splice(index, 1)
      this.updateDiarySummary()
    }, 350)
  }

  updateDiarySummary() {
    const nutriments = ['calory', 'protein', 'carb', 'fat']
    this.solveState()
    setTimeout(() => {
      const cached_summary = deepCopy(this.summary)
      this.summary = ({
        delivered: { calory: 0, protein: 0, carb: 0, fat: 0 },
        remain: ({ ...this.summary.nutriments }),
        nutriments: ({ ...this.summary.nutriments })
      })

      nutriments.forEach((nutriment, i) => {
        this.mealTemplatesCmp.toArray().forEach(({ mealTemplateSummary: { templateSummary } }) => {
          const { totalCalory, quantity } = templateSummary
          const acc = i === 0 ? totalCalory : quantity[nutriment]
          this.summary.delivered[nutriment] += acc
        })
        this.summary.remain[nutriment] = this.summary.nutriments[nutriment] - this.summary.delivered[nutriment]
      })
      this.summaryCountAnimation(cached_summary)
    }, 400)
  }

  solveState() {
    this.buttonState = {
      save: {
        disabled: false,
        message: 'Dziennik powinien:\n'
      },
      nextTemplate: {
        disabled: false,
        message: 'Dziennik powinien:\n'
      },
      search: {
        disabled: false
      }
    }

    this.diary.name === '' ? this.buttonState.save.message += '• posiadać swoją nazwę\n' : null

    const templatesLength = this.diary.mealTemplates.length
    templatesLength < 3 ? this.buttonState.save.message += '• mieć co najmniej 3 posiłki\n' :
      templatesLength > 6 ? this.buttonState.nextTemplate.message += '• mieć co najwyżej 7 posiłków\n' : null

    this.buttonState.search.disabled = templatesLength > 6

    const templateNames = this.diary.mealTemplates.some(({ name }) => name === '' || name === undefined)
    const templateProducts = this.diary.mealTemplates.some(({ products }) => products.length === 0)

    const properties = ['save', 'nextTemplate']
    if (templateNames) this.buttonState.save.message += '• posiadać nazwy posiłków\n'

    properties.forEach(property => {
      if (templateProducts) this.buttonState[property].message += '• posiadać produkty w posiłku\n'
      if (this.buttonState[property].message.length > 20) this.buttonState[property].disabled = true
    })
  }

  summaryCountAnimation(cached_summary) {
    const { delivered, remain } = deepCopy(this.summary)
    const nutriments = ['calory', 'protein', 'carb', 'fat'], properties = Object.keys(this.summary)
    properties.pop()

    properties.forEach((property, i) =>
      nutriments.forEach(nutriment =>
        counterAnimation(cached_summary[property][nutriment], this.summary[property][nutriment])
          .pipe(finalize(() => this.summary[property][nutriment] = i === 0 ? delivered[nutriment] : remain[nutriment] || 0))
          .subscribe(value => this.summary[property][nutriment] = +value.toFixed(1))
      )
    )
  }

  nutrimentsCountAnimation(userNutriments) {
    const nutriments = ['calory', 'protein', 'carb', 'fat']

    nutriments.forEach(nutriment =>
      counterAnimation(this.summary.nutriments[nutriment], userNutriments[nutriment])
        .pipe(finalize(() => {
          this.summary.nutriments[nutriment] = userNutriments[nutriment]
          this.updateDiarySummary()
        }))
        .subscribe(value => this.summary.nutriments[nutriment] = +value.toFixed(1)))
  }

  openMacroDialog(element) {
    const dialogRef = this.dialog.open(CaloryHelpDialogComponent, {
      disableClose: true,
      autoFocus: false
    })
    dialogRef.afterClosed().pipe(
      tap(() => element._elementRef.nativeElement.blur()),
      filter(Boolean)
    ).subscribe((res: Macro) => {
      const macro = { ...res, calory: getCalory(res) }
      this.userMacro$ = of(({ ...macro }))
        .pipe(
          tap(macro => {
            this.nutrimentsCountAnimation({ ...macro })
          }),
        )
      if (this.editMode) {
        this.userMacroEmitter.emit({ ...macro })
        setTimeout(() => this.templates.forEach(template => fromToOpacityAnimation(template.nativeElement, 0.01)), 20)
      }
      this.snackBar.open('Kaloryka została zaktualizowana', 1500)
    })
  }

  saveTemplate(index) {
    const products = this.diary.mealTemplates[index].products.map(product => clearProduct(product))

    const { time, name } = this.diary.mealTemplates[index]
    const mealTemplate = { time: time, name: name, products: products }

    this.mealTemplateService.save(mealTemplate).subscribe(({ id }) => {
      this.diary.mealTemplates[index].id = id
      this.snackBar.open('Szablon został zapisany')
    }, (error: HttpErrorResponse) => {
      let message = error.status === 409 ? 'Nazwa już istnieje' : 'Błąd serwera'
      if (error.status === 409) this.diary.mealTemplates[index].name = ''
      this.snackBar.open(message, 1400, true)
    })
  }

  save() {
    const { name } = this.diary

    const mealTemplates = this.diary.mealTemplates.map(({ name, time, products }) => {
      const modifiedProducts = products.map(product => {
        const { id, ...rest } = clearProduct(deepCopy(product))
        return rest
      })
      return { name, time, products: modifiedProducts }
    })

    timer(50).pipe(
      mergeMap(() => iif(() => this.editMode,
        this.diaryService.update({ name, mealTemplates }, this.diary._id),
        this.diaryService.save({ name, mealTemplates })))
    ).subscribe(() => {
      this.snackBar.open(this.editMode ? 'Dziennik pomyślnie zaktualizowany' : 'Dziennik pomyślnie zapisany')
      if (this.editMode) {
        this.backEmitter.emit(true)
      } else {
        this.diary = deepCopy(this.diaryInitialState)
        this.diaryNameEmitter.emit(true)
        setTimeout(() => fromToOpacityAnimation(this.templates.toArray()[0].nativeElement, 1.5), 10)
        this.updateDiarySummary()
      }
    })
  }

  constructor(private dialog: MatDialog, private snackBar: SnackBarService,
    private mealTemplateService: MealTemplateService, private diaryService: DiaryService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.editMode ?
        this.templates.forEach(template => fromToOpacityAnimation(template.nativeElement, 1.5)) :
        fromToOpacityAnimation(this.templates.toArray()[0].nativeElement, 1.5)
    }, 50)
  }

}
