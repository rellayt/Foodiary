import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatTooltipDefaultOptions, MAT_TOOLTIP_DEFAULT_OPTIONS } from '@angular/material/tooltip';
import { ActivatedRoute } from '@angular/router';
import { timer, Subscription, iif } from 'rxjs';
import { filter, first, map, mergeMap, tap } from 'rxjs/operators';
import { PersonalDataService } from '../../../services/personal-data.service';
import { SnackBarService } from '../../../services/snack-bar.service';

export const tooltipOptions: MatTooltipDefaultOptions = {
  showDelay: 50,
  hideDelay: 50,
  touchendHideDelay: 150,
};

@Component({
  selector: 'app-personal-data-form',
  templateUrl: './personal-data-form.component.html',
  styleUrls: ['./personal-data-form.component.scss'],
  providers: [
    { provide: MAT_TOOLTIP_DEFAULT_OPTIONS, useValue: tooltipOptions },
  ],
})
export class PersonalDataFormComponent implements OnInit, OnDestroy {

  genders = [
    { value: 'male', viewValue: 'Mężczyzna' },
    { value: 'female', viewValue: 'Kobieta' },
  ];

  provinces = [
    { value: 1, viewValue: 'Dolnośląskie' },
    { value: 2, viewValue: 'Kujawsko-pomorskie' },
    { value: 3, viewValue: 'Lubelskie' },
    { value: 4, viewValue: 'Lubuskie' },
    { value: 5, viewValue: 'Łódzkie' },
    { value: 6, viewValue: 'Małopolskie' },
    { value: 7, viewValue: 'Mazowieckie' },
    { value: 8, viewValue: 'Opolskie' },
    { value: 9, viewValue: 'Podkarpackie' },
    { value: 10, viewValue: 'Podlaskie' },
    { value: 11, viewValue: 'Pomorskie' },
    { value: 12, viewValue: 'Śląskie' },
    { value: 13, viewValue: 'Świętokrzyskie' },
    { value: 14, viewValue: 'Warmińsko-mazurskie' },
    { value: 15, viewValue: 'Wielkopolskie' },
    { value: 16, viewValue: 'Zachodniopomorskie' },
  ]

  minDate = new Date(1920, 0, 1);
  maxDate = new Date(2005, 0, 1);

  personalDataForm: any
  personalData$ = this.route.data.pipe(
    map(data => data.personalData),
    filter(personalData => personalData !== null),
    first(),
    tap(personalData => personalData ? this.personalDataForm.patchValue(personalData) : '')
  )
  formSubscription: Subscription
  personalDataId: string;
  buttonStatus = false

  constructor(private form: FormBuilder, private route: ActivatedRoute,
    private personalDataService: PersonalDataService, private snackBar: SnackBarService) {
    this.personalDataForm = this.form.group({
      forename: this.form.control(null, [Validators.pattern("[a-ząćęłńóś źżA-ZĄĆĘŁŃÓŚŹŻ]+"), Validators.minLength(3), Validators.maxLength(30)]),
      surname: this.form.control(null, [Validators.pattern("[a-ząćęłńóś źżA-ZĄĆĘŁŃÓŚŹŻ]+"), Validators.minLength(3), Validators.maxLength(30)]),
      gender: this.form.control(null),
      city: this.form.control(null, [Validators.minLength(3), Validators.pattern("[a-ząćęłńóś źżA-ZĄĆĘŁŃÓŚŹŻ]+")]),
      residingAbroad: this.form.control(false, {
        updateOn: 'change'
      }),
      dateOfBirth: this.form.control(null),
      province: this.form.control(null),
    }, { updateOn: 'blur' })
  }

  ngOnInit(): void {
    this.formSubscription = this.personalDataForm.statusChanges.subscribe(x => {
      const controlNames = Object.keys(this.personalDataForm.controls)
      let disable = true
      controlNames.forEach(controlName => {
        const controlValue = this.personalDataForm.controls[controlName].value
        if (controlValue !== null && controlValue !== false && controlValue !== "") disable = false
      })
      this.buttonStatus = !disable && this.personalDataForm.valid && this.personalDataForm.touched
    })

    this.personalData$.subscribe(data => {
      if (data) this.personalDataId = data['id']
    })
  }

  ngOnDestroy(): void {
    this.formSubscription.unsubscribe()
  }

  toggleControlValue() {
    const control = this.personalDataForm.controls['residingAbroad']
    control.setValue(!control.value)
    if (control.value) this.personalDataForm.controls['province'].reset()
  }

  save() {
    const formValue = Object.assign({}, this.personalDataForm.value)

    Object.keys(formValue).forEach((k) => (formValue[k] === null) && delete formValue[k])

    timer(200).pipe(
      mergeMap(v => iif(() => !!this.personalDataId,
        this.personalDataService.update(formValue, this.personalDataId),
        this.personalDataService.save(formValue)))
    ).subscribe(res => this.snackBar.open(!!this.personalDataId ?
      "Dane zostały zaktualizowane" : "Dane zostały zapisane"
    ))

  }

}
