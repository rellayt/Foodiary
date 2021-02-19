import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ZeroPrefixDeleterDirective } from './zero-prefix-deleter.directive';
import { InputMaxLengthDirective } from './input-max-length.directive';

@NgModule({
  declarations: [
    ZeroPrefixDeleterDirective,
    InputMaxLengthDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    ZeroPrefixDeleterDirective,
    InputMaxLengthDirective
  ]
})
export class DirectivesModule { }
