import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroupDirective, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { EMPTY } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { BodyDimensionsService } from '../../../services/body-dimensions.service';
import { SnackBarService } from '../../../services/snack-bar.service';

@Component({
  selector: 'app-body-dimensions-form',
  templateUrl: './body-dimensions-form.component.html',
  styleUrls: ['./body-dimensions-form.component.scss']
})
export class BodyDimensionsFormComponent implements OnInit {

  fields = [
    { viewValue: "Talia", control: "waist", suffix: "cm" },
    { viewValue: "Biodro", control: "hip", suffix: "cm" },
    { viewValue: "Udo", control: "thigh", suffix: "cm" },
    { viewValue: "Klatka piersiowa", control: "chest", suffix: "cm" },
    { viewValue: "Biceps", control: "biceps", suffix: "cm" },
  ]

  bodyDimensions$ = this.route.data.pipe(
    map(data => data.bodyDimensions)
  )

  constructor(private form: FormBuilder, private route: ActivatedRoute,
    private bodyDimensionsService: BodyDimensionsService, private snackBarService: SnackBarService) {
    this.bodyDimensionsForm = this.form.group({
      waist: this.form.control(null, [Validators.min(30), Validators.max(200)]),
      hip: this.form.control(null, [Validators.min(30), Validators.max(200)]),
      thigh: this.form.control(null, [Validators.min(20), Validators.max(130)]),
      chest: this.form.control(null, [Validators.min(40), Validators.max(150)]),
      biceps: this.form.control(null, [Validators.min(15), Validators.max(70)]),
    }, { updateOn: 'blur' })
  }

  bodyDimensionsForm: any

  ngOnInit(): void {

  }
  save(formDirective: FormGroupDirective) {
    this.bodyDimensionsService.save(this.bodyDimensionsForm.value)
      .pipe(
        catchError(() => {
          this.snackBarService.open("Pola nie mogą być puste", 1200, true)
          return EMPTY
        })
      )
      .subscribe(res => {
        this.bodyDimensionsService.clearCache()
        this.bodyDimensions$ = this.bodyDimensionsService.getLatestBodyDimensions()

        formDirective.resetForm()
        this.bodyDimensionsForm.reset()

        this.snackBarService.open("Wymiary zostały zapisane")
      })

  }
}
