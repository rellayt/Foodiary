import { Directive, ElementRef, Renderer2, HostListener } from '@angular/core';

@Directive({
  selector: '[commaReplacer]'
})
export class CommaReplacerDirective {

  constructor(private elementRef: ElementRef, private renderer: Renderer2) {
  }

  @HostListener('input') valueChanges() {

    const reg = /^(?:\d{1,3}(?:.\d{3})*|\d+)$/;
    const value = this.elementRef.nativeElement.value.replace(/,/g, '.').match(reg);
    this.renderer.setProperty(this.elementRef.nativeElement, 'value', value)
  }
}
