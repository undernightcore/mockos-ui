import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header.component';
import { MatButtonModule } from '@angular/material/button';
import {InputModule} from "../../input/input.module";

@NgModule({
  declarations: [HeaderComponent],
  imports: [
    CommonModule,
    MatButtonModule,
    InputModule,
  ],
  exports: [HeaderComponent],
})
export class HeaderModule {}
