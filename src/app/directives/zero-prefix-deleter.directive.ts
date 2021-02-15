import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[zeroPrefixDeleter]'
})
export class ZeroPrefixDeleterDirective {

  constructor(private elementRef: ElementRef,) {
  }

  @HostListener('input') valueChanges() {
    this.elementRef.nativeElement.value = +this.elementRef.nativeElement.value;
  }

}
