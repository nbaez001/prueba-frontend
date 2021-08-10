import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { LayoutModule } from '@angular/cdk/layout';
import { HttpClientModule } from '@angular/common/http';
import { ResponsiveRowsDirective } from './intranet/directives/responsive-rows.directive';
import { UppercasedDirective } from './intranet/directives/uppercased.directive';
import { Uppercased2Directive } from './intranet/directives/uppercased2.directive';



@NgModule({
  declarations: [
    ResponsiveRowsDirective,
    UppercasedDirective,
    Uppercased2Directive,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    LayoutModule,
    HttpClientModule,
  ],
  exports: [
    ReactiveFormsModule,
    LayoutModule,
    HttpClientModule,

    ResponsiveRowsDirective,
    UppercasedDirective,
    Uppercased2Directive,
  ]
})
export class SharedModule { }
