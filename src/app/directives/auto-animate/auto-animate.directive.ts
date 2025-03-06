import {
  AfterViewInit,
  Directive,
  ElementRef,
  Input,
} from "@angular/core";
import autoAnimate, { AutoAnimateOptions } from '@formkit/auto-animate';

@Directive({
  selector: "[auto-animate]",
})
export class AutoAnimateDirective implements AfterViewInit {
  @Input() options: Partial<AutoAnimateOptions> = {};

  constructor(private el: ElementRef) {}

  ngAfterViewInit(): void {
    autoAnimate(this.el.nativeElement, this.options)
  }
}