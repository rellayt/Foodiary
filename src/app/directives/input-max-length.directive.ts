import { Directive, ElementRef, HostListener, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[inputMaxLength]'
})
export class InputMaxLengthDirective {

  @Input()
  inputMaxLength: number

  constructor(private elementRef: ElementRef, private renderer: Renderer2) { }

  @HostListener('input') valueChanges() {

    const input = "" + this.elementRef.nativeElement.value
    if (input.length > this.inputMaxLength) {
      this.elementRef.nativeElement.value = +input.slice(0, -1)
    }
  }
}
