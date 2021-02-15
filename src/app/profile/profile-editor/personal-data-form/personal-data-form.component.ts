import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-personal-data-form',
  templateUrl: './personal-data-form.component.html',
  styleUrls: ['./personal-data-form.component.scss']
})
export class PersonalDataFormComponent implements OnInit {
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
  constructor(private form: FormBuilder) {
    this.personalDataForm = this.form.group({
      forename: this.form.control(null, [Validators.pattern("[a-zA-Z]+"), Validators.minLength(3), Validators.maxLength(30)]),
      surname: this.form.control(null, [Validators.pattern("[a-zA-Z]+"), Validators.minLength(3), Validators.maxLength(30)]),
      gender: this.form.control(null),
      city: this.form.control(null, Validators.pattern("[a-zA-Z]+")),
      residingAbroad: this.form.control(false, {
        updateOn: 'change'
      }),
      dateOfBirth: this.form.control(null),
      province: this.form.control(null),
    }, { updateOn: 'blur' });
  }
  toggleControlValue() {
    const control = this.personalDataForm.controls['residingAbroad']
    control.setValue(!control.value)
    if (control.value) this.personalDataForm.controls['province'].reset()
  }
  save() {
    const formValue = Object.assign({}, this.personalDataForm.value)

    formValue['dateOfBirth'] = formValue['dateOfBirth'] ? formValue['dateOfBirth'].toDate() : null

    Object.keys(formValue).forEach((k) => (formValue[k] === null) && delete formValue[k])
  }

  ngOnInit(): void {
  }

}
