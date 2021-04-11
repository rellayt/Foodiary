import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { getCalory } from '../../../utility/macro-calculations';
import { Diary } from '../../../models/diary.model';
import { Macro } from 'src/app/models/macro.model';

@Component({
  selector: 'app-diary-expansion',
  templateUrl: './diary-expansion.component.html',
  styleUrls: ['./diary-expansion.component.scss']
})
export class DiaryExpansionComponent implements OnInit {

  diary: Diary = mock_data
  @Input() userMacro: Macro;

  diarySummary = {
    delivered: { 'protein': 0, 'carb': 0, 'fat': 0, 'calory': 0 },
    remain: { 'protein': 0, 'carb': 0, 'fat': 0, 'calory': 0 }
  }

  @Output() backEmitter: EventEmitter<string> = new EventEmitter()
  @Output() editEmitter: EventEmitter<Boolean> = new EventEmitter()
  @Output() deleteEmitter: EventEmitter<any> = new EventEmitter()

  constructor() { }

  ngOnInit(): void { }

  @Input() set setDiary(data) {
    this.diary = { ...data as Diary };
    const productLists = this.diary.mealTemplates.map(mealTemplate => mealTemplate.products.map(product => {
      return {
        ...product,
        calory: Math.round(getCalory(product))
      }
    })
    )
    const nutriments = ['protein', 'carb', 'fat', 'calory']
    productLists.forEach((products, i) => {
      this.diary.mealTemplates[i].products = products

      const summary = { protein: 0, carb: 0, fat: 0, calory: 0 }

      products.forEach(product => {
        nutriments.forEach(nutriment => {
          summary[nutriment] += product[nutriment]

        })
      })
      this.diary.mealTemplates[i].summary = summary
      Object.entries(summary).map(([key, value]) => this.diary.mealTemplates[i].summary[key] = +value.toFixed(1))
    })
    const diarySummary = this.diary.mealTemplates
      .map(mealtemplate => Object.values(mealtemplate.summary))
      .reduce((prev, [protein, carb, fat, calory]) => {
        const nutrimentValues = [protein, carb, fat, calory]
        nutriments.forEach((nutriment, i) => prev[nutriment] += nutrimentValues[i])
        return prev;
      }, { 'protein': 0, 'carb': 0, 'fat': 0, 'calory': 0 })

    Object.entries(diarySummary).map(([key, value]) => this.diarySummary.delivered[key] = +(+value).toFixed(1))
    Object.keys(this.diarySummary.delivered).map((key) => this.diarySummary.remain[key] = +(this.userMacro[key] - this.diarySummary.delivered[key]).toFixed(1))
  }

  goBack() {
    this.backEmitter.emit('view')
  }
  goToEdit() {
    this.editEmitter.emit(true)
  }

  delete(deleteButtonRef) {
    this.deleteEmitter.emit(deleteButtonRef)
  }
}

const mock_data = {
  "_id": "606f90052dae710a2c5313f9",
  "mealTemplates": [
    {
      "time": "12:40",
      "name": "Posiłek nr.1",
      "products": [
        {
          "protein": 22,
          "carb": 12,
          "fat": 6,
          "quantity": 50,
          "name": "twaróg2"
        },
        {
          "protein": 44,
          "carb": 24,
          "fat": 12,
          "quantity": 100,
          "name": "twaróg2"
        },
        {
          "protein": 17,
          "carb": 0.5,
          "fat": 4.9,
          "quantity": 100,
          "name": "Szynka konserwowa z galaretką"
        },
        {
          "protein": 8.5,
          "carb": 0.3,
          "fat": 2.5,
          "quantity": 50,
          "name": "Szynka konserwowa z galaretką"
        }
      ]
    },
    {
      "time": "15:30",
      "name": "Posiłek nr.2",
      "products": [
        {
          "protein": 12.5,
          "carb": 25,
          "fat": 5,
          "quantity": 50,
          "name": "twaróg3"
        },
        {
          "quantity": 50,
          "protein": 6,
          "carb": 31,
          "fat": 3.6,
          "name": "Płatki owsiane-górskie błyskawiczne"
        },
        {
          "quantity": 50,
          "protein": 6,
          "carb": 31,
          "fat": 3.6,
          "name": "Płatki owsiane-górskie błyskawiczne"
        },
        {
          "protein": 12.5,
          "carb": 25,
          "fat": 5,
          "quantity": 50,
          "name": "twaróg3"
        }
      ]
    },
    {
      "time": "18:35",
      "name": "Posiłek nr.3",
      "products": [
        {
          "protein": 19.5,
          "carb": 46.5,
          "fat": 11.3,
          "quantity": 75,
          "name": "abcc"
        },
        {
          "protein": 26,
          "carb": 62,
          "fat": 15,
          "quantity": 100,
          "name": "abcc"
        },
        {
          "protein": 49.5,
          "carb": 0,
          "fat": 0,
          "quantity": 50,
          "name": "białeczko"
        },
        {
          "quantity": 50,
          "protein": 10.5,
          "carb": 1.3,
          "fat": 1,
          "name": "Szynka z fileta kurczaka"
        }
      ]
    }
  ],
  "name": "Dziennik 24/03/21 nr.1",
  "created_at": "2021-04-08T23:21:41.679Z",
  "updated_at": "2021-04-08T23:21:41.679Z"
}
