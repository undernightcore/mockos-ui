import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckboxGroupComponent } from './checkbox-group.component';

@NgModule({
  declarations: [CheckboxGroupComponent],
  exports: [CheckboxGroupComponent],
  imports: [CommonModule],
})
export class CheckboxGroupModule {}
