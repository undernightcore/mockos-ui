import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputComponent } from './input.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ErrorPipe } from './pipes/error.pipe';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [InputComponent, ErrorPipe],
  imports: [CommonModule, ReactiveFormsModule, TranslateModule],
  exports: [InputComponent],
})
export class InputModule {}
