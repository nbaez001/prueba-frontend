import { Directive, ElementRef, Input } from '@angular/core';
@Directive({
  selector: '[Uppercased2]',
  host: { '(input)': 'toUpperCase($event.target.value)', }
})

export class Uppercased2Directive {
  @Input('Uppercased2') allowUpperCase: boolean;
  constructor(private ref: ElementRef) {
  }

  toUpperCase(value: any) {
    if (this.allowUpperCase)
      this.ref.nativeElement.value = value.toUpperCase();
  }

}