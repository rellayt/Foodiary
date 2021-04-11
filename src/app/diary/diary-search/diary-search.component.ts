import { Component, OnInit, Output, EventEmitter, ElementRef, ViewChild, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, filter, map, switchMap, tap } from 'rxjs/operators';
import { MealTemplate } from '../../models/mealTemplate.model';
import { MealTemplateService } from '../../services/mealTemplate.service';
import { createTemplateSummary } from '../../utility/meal-template-calculations';

@Component({
  selector: 'app-diary-search',
  templateUrl: './diary-search.component.html',
  styleUrls: ['./diary-search.component.scss']
})
export class DiarySearchComponent implements OnInit {
  @ViewChild('queryRef') queryRef: ElementRef

  @Output() queryMealTemplate = new EventEmitter<MealTemplate>()

  query = new FormControl('')
  loading = false
  selectedMealTemplate: MealTemplate = null
  options: MealTemplate[] = []

  constructor(private mealTemplateService: MealTemplateService) { }

  ngOnInit(): void {
    this.query.valueChanges
      .pipe(
        debounceTime(250),
        tap(value =>
          this.selectedMealTemplate && this.selectedMealTemplate.name !== value ?
            this.loading = true : ''
        ),
        filter((value: string) => !!value && value.length > 1 && value !== ''),
        switchMap((value: string) => this.mealTemplateService.getMany(value)),
        map(mealTemplates => createTemplateSummary(mealTemplates) || []))
      .subscribe((data: MealTemplate[]) => {
        this.loading = false
        this.options = data;
      })
  }
  @Input() set searchDisable(value) {
    value ? this.query.disable() : this.query.enable()
  }

  selectMealTemplate(mealTemplate: MealTemplate) {
    this.query.reset()
    setTimeout(() => {
      this.options = []
      this.query.setValue('')
      this.queryRef.nativeElement.blur()
    }, 100)
    this.queryMealTemplate.emit(mealTemplate)
  }
}
