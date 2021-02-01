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
  config = {
    pattern: 'Nieprawidłowe dane'
  }
  checked = false;

  personalDataForm: any
  constructor(private formBuilder: FormBuilder) {
    this.personalDataForm = this.formBuilder.group({
      firstName: ['', [Validators.pattern("[a-zA-Z]+"), Validators.minLength(3), Validators.maxLength(30)]],
      lastName: ['', [Validators.pattern("[a-zA-Z]+"), Validators.minLength(3), Validators.maxLength(30)]],
    });
  }

  ngOnInit(): void {
  }

}
