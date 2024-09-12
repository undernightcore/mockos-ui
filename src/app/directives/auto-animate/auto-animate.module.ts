import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AutoAnimateDirective } from './auto-animate.directive';

@NgModule({
  declarations: [AutoAnimateDirective],
  imports: [CommonModule],
  exports: [AutoAnimateDirective],
})
export class AutoAnimateModule {}
