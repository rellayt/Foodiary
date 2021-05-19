import { Component, ElementRef, OnInit, ViewChild, OnDestroy, EventEmitter, Output, Input } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { physicalActivity, calculateBasicMetabolism } from '../../../helpers/userCalory';
import { startAnimation, endAnimation, fromToOpacityAnimation } from '../../../utility/basic-animations';
import { finalize } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-calory-register-form',
  templateUrl: './calory-register-form.component.html',
  styleUrls: ['./calory-register-form.component.scss']
})
export class CaloryRegisterFormComponent implements OnInit, OnDestroy {
  @ViewChild('calorySummary', { static: true }) calorySummary: ElementRef;
  @Output() userMacroEmitter = new EventEmitter()

  caloryForm: any
  physicalActivity = physicalActivity

  userMacro = { protein: 0, carb: 0, fat: 0 }
  targets = {
    loss: { value: (calory) => -calory * 0.12, view: 'schudnąć' },
    stay: { value: () => 0, view: 'utrzymać wagę' },
    mass: { value: (calory) => calory * 0.12, view: 'przytyć' }
  }

  statusSubscription: Subscription

  userInfo = {
    caloryTarget: { name: 'stay', view: 'zachować' },
    calory: 0,
    basicMetabolism: 0,
    overallMetabolism: 0
  }
  @Input() questionnaireData = []
  statusFlag = false

  ngOnInit(): void {
    // const array = [1, 0, 2, 1]
    // this.received = array

    const selectedActivity = { ...physicalActivity[this.questionnaireData[2] + 1] }
    this.caloryForm.controls['activity'].setValue(selectedActivity.viewValue)

    this.statusSubscription = this.caloryForm.statusChanges.subscribe((status: string) => {
      if (status === 'VALID' && !this.statusFlag) {
        setTimeout(() => {
          fromToOpacityAnimation(this.calorySummary.nativeElement, 0.6, 0, 0)
          let delay = 0.3;
          this.calorySummary.nativeElement.childNodes.forEach(node => {
            fromToOpacityAnimation(node, 0.7, 0, -10, delay)
            delay += 0.2
          })
        }, 50)
      }

      if (status === 'VALID') {
        this.macroCalculation()
        if (!this.statusFlag) this.statusFlag = true
      } else if (this.statusFlag) this.userMacroEmitter.emit(null)

      if (status === 'INVALID' && this.statusFlag) {
        endAnimation(this.calorySummary.nativeElement, 0.4)
        setTimeout(() => this.statusFlag = false, 400)
      }
    })
  }

  ngOnDestroy(): void {
    this.statusSubscription.unsubscribe()
  }

  constructor(private form: FormBuilder) {
    this.caloryForm = form.group({
      weight: this.form.control('', [
        Validators.required,
        Validators.min(35),
        Validators.max(180)
      ]),
      height: this.form.control('', [
        Validators.required,
        Validators.min(100),
        Validators.max(230)
      ]),
      age: this.form.control('', [
        Validators.required,
        Validators.min(12),
        Validators.max(120)
      ]),
      activity: this.form.control('')
    }, { updateOn: 'blur' })
  }

  macroCalculation() {
    const { activity: activityView } = this.caloryForm.value
    const activityValue = this.physicalActivity.find(obj => obj.viewValue === activityView).value
    const gender = this.questionnaireData[0] === 0 ? 'female' : 'male'
    this.userInfo.basicMetabolism = calculateBasicMetabolism({ ...this.caloryForm.value, gender })
    const Sddp = this.userInfo.basicMetabolism / 10

    this.userInfo.overallMetabolism = this.userInfo.basicMetabolism * activityValue + Sddp

    const userTarget = this.questionnaireData[3] === 0 ? 'loss' : this.questionnaireData[3] === 1 ? 'stay' : 'mass'
    this.calculateTarget(!this.statusFlag ? userTarget : this.userInfo.caloryTarget.name)
  }

  calculateTarget(name: string) {
    const { view } = this.targets[name]
    this.userInfo.caloryTarget = { view, name }

    const targetValue = this.targets[name].value(name === 'stay' ? null : this.userInfo.overallMetabolism)
    const calory = Math.round(this.userInfo.overallMetabolism + targetValue)

    this.userMacro.protein = Math.round((calory * 0.23) / 4)
    this.userMacro.carb = Math.round((calory * 0.54) / 4)
    this.userMacro.fat = Math.round((calory * 0.23) / 9)
    this.userInfo.calory = calory

    this.userMacroEmitter.emit(this.userMacro)
  }
}
