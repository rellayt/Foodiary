import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MacroService } from '../services/macro.service';
import { subpageInitAnimation } from '../utility/subpage-animations';
import { PersonalDataService } from '../services/personal-data.service';
import { MeasurementService } from '../services/measurement.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit, OnDestroy {
  @ViewChild('profileCardRef', { static: true }) profileCardRef: ElementRef;

  constructor(private macro: MacroService, private personalData: PersonalDataService
    , private measurement: MeasurementService) {
  }

  ngOnInit(): void {
    subpageInitAnimation(this.profileCardRef.nativeElement, 0, 0.7, 0)
  }
  ngOnDestroy(): void {
    this.macro.clearCache()
    this.personalData.clearCache()
    this.measurement.clearCache()
  }

}
