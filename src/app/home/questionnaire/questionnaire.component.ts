import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Question } from 'src/app/models/question.model';
import { questionsList } from '../../helpers/questionsList';
import { startAnimation, progressAnimation, fromToOpacityAnimation, endAnimation } from '../../utility/basic-animations';
import { gsap } from 'gsap';
import { replaceAt } from '../../utility/string-replacer';
import { Router } from '@angular/router';

@Component({
  selector: 'app-questionnaire',
  templateUrl: './questionnaire.component.html',
  styleUrls: ['./questionnaire.component.scss']
})
export class QuestionnaireComponent implements OnInit {
  @ViewChild('questionContainer', { static: true }) questionContainer: ElementRef;
  @ViewChild('slider', { static: true }) slider: ElementRef;
  @ViewChild('answers', { static: true }) answers: ElementRef;
  @ViewChild('progress', { static: true }) progress: ElementRef;
  @ViewChild('actions', { static: true }) actions: ElementRef;

  currentQuestionIndex = 0;
  progressValue: number;
  questions: Question[] = questionsList;

  selectedOption: number = null
  selectedOptions: number[] = []

  constructor(private cdr: ChangeDetectorRef, private router: Router) { }

  ngOnInit(): void {
    this.initialAnimations()
    this.increaseProgressValue(1.5)
  }

  get question(): Question {
    const question = this.questions[this.currentQuestionIndex]
    if (this.currentQuestionIndex === 1) {
      const letter = this.selectedOptions[0] === 1 ? 'e' : 'a'
      question.query = replaceAt(question.query, 11, letter)
    }
    return question
  }
  get isButtonEnabled(): Boolean {
    const nodes = this.answers.nativeElement.childNodes

    for (let i = 0; i < nodes.lenth; i++) {
      if (nodes[i].classList && nodes[i].classList.contains('selected')) return true
    }
    return false
  }

  increaseProgressValue(delay = 0) {
    this.progressValue = (100 * (this.currentQuestionIndex + 1)) / this.questions.length;
    progressAnimation(this.slider.nativeElement, 0.7, delay, `${this.progressValue}%`)
  }

  initialAnimations() {
    startAnimation(this.questionContainer.nativeElement, 1.5)
    const nodes = this.questionContainer.nativeElement.childNodes
    let delay = 0.4;
    for (let i = 0; i < 5; i++) {
      startAnimation(nodes[i], 0.5, 0, -20, delay)
      delay += 0.2
    }
  }

  onSelect(answer: HTMLDivElement, index) {
    this.answers.nativeElement.childNodes.forEach((node: HTMLDivElement) =>
      node.classList && node.classList.contains('selected') ? node.classList.remove('selected') : null)


    this.selectedOption = index
    answer.classList.add('selected')
  }

  manageAction(state) {
    if (state === 'next' && this.currentQuestionIndex === 3) {
      setTimeout(() => {
        this.selectedOptions.push(this.selectedOption)
        endAnimation(this.questionContainer.nativeElement, 0.8)
        setTimeout(() =>
          this.router.navigateByUrl('/register_extended', { state: { questionnaireData: this.selectedOptions } }), 800);
      }, 150);
      return
    }
    const nodes = this.questionContainer.nativeElement.childNodes
    let delay = 0.1;
    for (let i = 0; i < 3; i++) {
      endAnimation(nodes[i], 0.5, 0, -20, 1, delay)
      delay += 0.2
    }
    setTimeout(() => {
      if (state === 'next') {
        this.selectedOptions.push(this.selectedOption)
        this.currentQuestionIndex++;
        this.increaseProgressValue();
      } else {
        this.selectedOptions.pop()
        this.currentQuestionIndex--;
        this.increaseProgressValue();
      }
      this.cdr.detectChanges();
      delay = 0.1
      for (let i = 0; i < 3; i++) {
        fromToOpacityAnimation(nodes[i], 0.5, 0, -20, delay)
        delay += 0.2
      }
      this.selectedOption = null
    }, 900)
  }
}
