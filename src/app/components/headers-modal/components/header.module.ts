import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header.component';
import { MatButtonModule } from '@angular/material/button';
import {InputModule} from "../../input/input.module";
import {ReactiveFormsModule} from "@angular/forms";

@NgModule({
  declarations: [HeaderComponent],
  imports: [CommonModule, MatButtonModule, InputModule, ReactiveFormsModule],
  exports: [HeaderComponent],
})
export class HeaderModule {}
