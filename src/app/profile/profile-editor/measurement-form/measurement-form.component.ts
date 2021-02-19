import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroupDirective, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { defaultIfEmpty, map } from 'rxjs/operators';
import { MeasurementService } from '../../../services/measurement.service';
import { SnackBarService } from '../../../services/snack-bar.service';

@Component({
  selector: 'app-measurement-form',
  templateUrl: './measurement-form.component.html',
  styleUrls: ['./measurement-form.component.scss']
})
export class MeasurementFormComponent implements OnInit {

  measurementForm: any

  fields = [
    { viewValue: "Waga", control: "weight", suffix: "kg" },
    { viewValue: "Tkanka tłuszczowa", control: "bodyFat", suffix: "%" },
  ]

  measurement$ = this.route.data.pipe(
    map(data => data.measurement),
  )

  constructor(private form: FormBuilder, private route: ActivatedRoute,
    private measurementService: MeasurementService, private snackBarService: SnackBarService) {
    this.measurementForm = this.form.group({
      weight: this.form.control(null, [Validators.required, Validators.min(30), Validators.max(250)]),
      bodyFat: this.form.control(null, [Validators.required, Validators.min(2), Validators.max(80)]),
    }, { updateOn: 'blur' })
  }


  ngOnInit(): void {
  }
  save(formDirective: FormGroupDirective) {
    this.measurementService.save(this.measurementForm.value).subscribe(res => {
      this.measurementService.clearCache()
      this.measurement$ = this.measurementService.getLatestMeasurement()
      formDirective.resetForm()
      this.measurementForm.reset()
      this.snackBarService.open("Pomiary zostały zapisane")
    })
  }
}
